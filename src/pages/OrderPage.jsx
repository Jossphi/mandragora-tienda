import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../hooks/useProducts';
import { getPaymentMethod } from '../config/store';
import { primaryButton, secondaryButton, alertStyle, pageTitle } from '../components/ui/formStyles';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const ORDER_SELECT = `
  id, order_number, created_at, payment_method, payment_receipt_url, subtotal, shipping_cost, total_amount, shipping_address,
  order_statuses ( code, label, color_hex ),
  order_items ( id, quantity, unit_price, product_variants ( label, products ( name, slug, product_images ( image_url, is_primary ) ) ) )
`;
const MAX_FILE_MB = 8;

export default function OrderPage({ orderId, onNavigate }) {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from('orders').select(ORDER_SELECT).eq('id', orderId).maybeSingle();
    setOrder(data);
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { onNavigate(`login?next=order/${orderId}`, { replace: true }); return; }
    load();
  }, [authLoading, user, orderId, load, onNavigate]);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\/|application\/pdf/.test(file.type)) {
      setMsg({ type: 'error', text: 'Sube una imagen (captura) o un PDF.' });
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setMsg({ type: 'error', text: `El archivo pesa más de ${MAX_FILE_MB} MB.` });
      return;
    }
    setUploading(true);
    setMsg(null);
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${user.id}/${order.id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('receipts').upload(path, file, { contentType: file.type });
    if (upErr) {
      setUploading(false);
      setMsg({ type: 'error', text: 'No pudimos subir el archivo. Inténtalo otra vez.' });
      return;
    }
    const { error: rpcErr } = await supabase.rpc('attach_payment_receipt', { p_order_id: order.id, p_path: path });
    setUploading(false);
    if (rpcErr) {
      setMsg({ type: 'error', text: rpcErr.message });
      return;
    }
    setMsg({ type: 'success', text: '¡Recibimos tu comprobante! Revisaremos el pago y te confirmaremos tu pedido.' });
    load();
  };

  if (authLoading || loading) {
    return <main style={{ padding: '100px 20px', textAlign: 'center', color: '#8a7280' }}>Cargando pedido...</main>;
  }
  if (!order) {
    return (
      <main style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 style={pageTitle}>Pedido no encontrado</h1>
        <button style={{ ...secondaryButton, marginTop: 20 }} onClick={() => onNavigate('account')}>IR A MI CUENTA</button>
      </main>
    );
  }

  const method = getPaymentMethod(order.payment_method);
  const status = order.order_statuses || {};
  const canUpload = ['pending_payment', 'payment_uploaded'].includes(status.code);
  const addr = order.shipping_address || {};

  return (
    <main className="page-enter" style={{ maxWidth: 1080, margin: '0 auto', padding: '56px clamp(16px, 4vw, 40px) 40px' }}>
      <Breadcrumbs onNavigate={onNavigate} items={[{ label: 'Inicio', page: 'home' }, { label: 'Mi cuenta', page: 'account' }, { label: `Pedido #${order.order_number}` }]} />
      <h1 style={{ ...pageTitle, margin: '14px 0 6px' }}>Pedido #{order.order_number}</h1>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 34 }}>
        <StatusBadge status={status} />
        <span style={{ fontSize: 12.5, color: '#8a7280' }}>{new Date(order.created_at).toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' })}</span>
      </div>

      <div className="cart-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {canUpload && (
            <section style={{ border: `1.5px solid ${method?.color || '#aa2159'}`, padding: 'clamp(20px, 4vw, 30px)', background: '#fff' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', color: method?.color, marginBottom: 10 }}>
                {status.code === 'pending_payment' ? 'PASO FINAL: PAGA TU PEDIDO' : 'COMPROBANTE RECIBIDO'}
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 30, margin: '0 0 14px' }}>
                Paga {formatPrice(order.total_amount)} con {method?.label}
              </h2>
              {method?.phone ? (
                <div style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14 }}>
                  Número: <strong style={{ fontSize: 19, letterSpacing: '0.04em' }}>{method.phone}</strong>
                  {method.holder && <><br />A nombre de: <strong>{method.holder}</strong></>}
                </div>
              ) : (
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5a4450', margin: '0 0 14px' }}>
                  Te enviaremos el número de {method?.label} por WhatsApp al {addr.phone} para que realices el pago.
                </p>
              )}
              <ol style={{ fontSize: 13.5, color: '#5a4450', lineHeight: 1.8, paddingLeft: 18, margin: '0 0 20px' }}>
                <li>Abre {method?.label} y envía exactamente <strong>{formatPrice(order.total_amount)}</strong>.</li>
                <li>En el mensaje escribe tu número de pedido: <strong>#{order.order_number}</strong>.</li>
                <li>Toma una captura de la operación y súbela aquí.</li>
              </ol>
              <label style={{ ...primaryButton(uploading), display: 'inline-block' }}>
                {uploading ? 'SUBIENDO...' : order.payment_receipt_url ? 'CAMBIAR COMPROBANTE' : 'SUBIR COMPROBANTE DE PAGO'}
                <input type="file" accept="image/*,application/pdf" onChange={upload} disabled={uploading} style={{ display: 'none' }} />
              </label>
              {order.payment_receipt_url && !msg && (
                <p style={{ fontSize: 12.5, color: '#137a4b', marginTop: 12 }}>✓ Ya subiste tu comprobante. Lo estamos revisando.</p>
              )}
              {msg && <div style={{ ...alertStyle(msg.type), marginTop: 14 }}>{msg.text}</div>}
            </section>
          )}

          <section>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', marginBottom: 14 }}>PRODUCTOS</div>
            {order.order_items.map((oi) => {
              const p = oi.product_variants?.products;
              const img = p?.product_images?.find((i) => i.is_primary) || p?.product_images?.[0];
              const label = oi.product_variants?.label;
              return (
                <div key={oi.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0dde5' }}>
                  <div style={{ width: 56, height: 70, overflow: 'hidden', background: '#f6eef2', flexShrink: 0 }}>
                    {img && <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, fontSize: 13.5 }}>
                    {p?.name}{label && label !== 'Estándar' ? ` · ${label}` : ''}
                    <div style={{ color: '#8a7280', fontSize: 12.5 }}>{oi.quantity} x {formatPrice(oi.unit_price)}</div>
                  </div>
                  <div style={{ fontSize: 14 }}>{formatPrice(oi.unit_price * oi.quantity)}</div>
                </div>
              );
            })}
          </section>
        </div>

        <aside className="cart-summary">
          <div style={{ fontSize: 11, letterSpacing: '0.2em', marginBottom: 14 }}>RESUMEN</div>
          <Row label="Subtotal" value={formatPrice(order.subtotal ?? order.total_amount)} />
          <Row label="Envío" value={formatPrice(order.shipping_cost ?? 0)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-serif)', fontSize: 24, margin: '10px 0 22px' }}>
            <span>Total</span><span style={{ color: '#aa2159' }}>{formatPrice(order.total_amount)}</span>
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', marginBottom: 10 }}>ENVÍO A</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#5a4450', margin: '0 0 18px' }}>
            {addr.full_name}<br />{addr.address}, {addr.district}<br />{addr.department}{addr.reference ? <><br />Ref.: {addr.reference}</> : null}<br />Cel.: {addr.phone}
          </p>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', marginBottom: 6 }}>PAGO</div>
          <p style={{ fontSize: 13, color: '#5a4450', margin: '0 0 22px' }}>{method?.label}</p>
          <button style={{ ...secondaryButton, width: '100%' }} onClick={() => onNavigate('account')}>VER MIS PEDIDOS</button>
        </aside>
      </div>
    </main>
  );
}

export function StatusBadge({ status }) {
  return (
    <span style={{ fontSize: 11, letterSpacing: '0.12em', padding: '5px 10px', background: `${status.color_hex || '#888'}1f`, color: status.color_hex || '#555', border: `1px solid ${status.color_hex || '#888'}55`, whiteSpace: 'nowrap' }}>
      {(status.label || '').toUpperCase()}
    </span>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 8 }}>
      <span style={{ color: '#5a4450' }}>{label}</span><span>{value}</span>
    </div>
  );
}
