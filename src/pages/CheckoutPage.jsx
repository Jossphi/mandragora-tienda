import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../hooks/useProducts';
import { PAYMENT_METHODS } from '../config/store';
import { labelStyle, inputStyle, primaryButton, alertStyle, pageTitle } from '../components/ui/formStyles';

export default function CheckoutPage({ onNavigate }) {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const { items, subtotal, reload } = useCart();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ full_name: '', phone: '', department_id: '', district: '', address: '', reference: '' });
  const [payment, setPayment] = useState('yape');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) onNavigate('login?next=checkout');
  }, [authLoading, user, onNavigate]);

  useEffect(() => {
    supabase.from('departments').select('id, name, shipping_cost').eq('is_active', true).order('name')
      .then(({ data }) => setDepartments(data || []));
  }, []);

  useEffect(() => {
    if (profile && !prefilled) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        department_id: profile.department_id ? String(profile.department_id) : '',
        district: profile.district || '',
        address: profile.address || '',
        reference: profile.reference || '',
      });
      setPrefilled(true);
    }
  }, [profile, prefilled]);

  const dept = departments.find((d) => String(d.id) === form.department_id);
  const shipping = dept ? Number(dept.shipping_cost) : null;
  const total = subtotal + (shipping || 0);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!/^\+?[\d\s]{9,15}$/.test(form.phone.trim())) {
      setError('Ingresa un número de celular válido (9 dígitos).');
      return;
    }
    setSubmitting(true);
    const { data, error: err } = await supabase.rpc('place_order', {
      p_payment_method: payment,
      p_shipping: { ...form, department_id: Number(form.department_id) },
    });
    setSubmitting(false);
    if (err) {
      setError(err.message || 'No pudimos registrar tu pedido. Inténtalo de nuevo.');
      return;
    }
    await reload();
    refreshProfile();
    onNavigate(`order/${data.id}`);
  };

  if (authLoading || !user) {
    return <main style={{ padding: '100px 20px', textAlign: 'center', color: '#8a7280' }}>Cargando...</main>;
  }

  if (items.length === 0) {
    return (
      <main className="page-enter" style={{ maxWidth: 700, margin: '0 auto', padding: '90px 20px', textAlign: 'center' }}>
        <h1 style={pageTitle}>Tu carrito está vacío</h1>
        <button style={{ ...primaryButton(), marginTop: 24 }} onClick={() => onNavigate('joyeria')}>VER JOYERÍA</button>
      </main>
    );
  }

  return (
    <main className="page-enter" style={{ maxWidth: 1180, margin: '0 auto', padding: '56px clamp(16px, 4vw, 40px) 40px' }}>
      <div style={{ fontSize: '10.5px', letterSpacing: '0.3em', color: '#8a5f73' }}>CARRITO / FINALIZAR COMPRA</div>
      <h1 style={{ ...pageTitle, margin: '14px 0 30px' }}>Finalizar compra</h1>

      <form onSubmit={submit} className="cart-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          <section>
            <SectionTitle n="1" title="Datos de envío" />
            <div className="form-grid">
              <Field label="NOMBRE Y APELLIDO" full>
                <input required value={form.full_name} onChange={update('full_name')} style={inputStyle} autoComplete="name" />
              </Field>
              <Field label="CELULAR">
                <input required value={form.phone} onChange={update('phone')} style={inputStyle} inputMode="tel" autoComplete="tel" placeholder="987 654 321" />
              </Field>
              <Field label="DEPARTAMENTO">
                <select required value={form.department_id} onChange={update('department_id')} style={inputStyle}>
                  <option value="">Selecciona...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} — envío {formatPrice(d.shipping_cost)}</option>
                  ))}
                </select>
              </Field>
              <Field label="DISTRITO">
                <input required value={form.district} onChange={update('district')} style={inputStyle} />
              </Field>
              <Field label="DIRECCIÓN">
                <input required value={form.address} onChange={update('address')} style={inputStyle} autoComplete="street-address" placeholder="Av. / Calle, número, dpto." />
              </Field>
              <Field label="REFERENCIA (OPCIONAL)" full>
                <input value={form.reference} onChange={update('reference')} style={inputStyle} placeholder="Ej. frente al parque" />
              </Field>
            </div>
          </section>

          <section>
            <SectionTitle n="2" title="Método de pago" />
            <div className="pay-options">
              {PAYMENT_METHODS.map((m) => {
                const active = payment === m.id;
                return (
                  <label
                    key={m.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', cursor: 'pointer',
                      border: `1.5px solid ${active ? m.color : '#e0c9d3'}`,
                      background: active ? '#fff' : 'transparent',
                    }}
                  >
                    <input type="radio" name="payment" value={m.id} checked={active} onChange={() => setPayment(m.id)} style={{ accentColor: m.color }} />
                    <span style={{ width: 38, height: 38, borderRadius: 10, background: m.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 15 }}>
                      {m.label[0]}
                    </span>
                    <span>
                      <span style={{ display: 'block', fontSize: 15, fontWeight: 500 }}>{m.label}</span>
                      <span style={{ fontSize: 12, color: '#8a7280' }}>Paga desde tu app y sube la captura</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <p style={{ fontSize: 12.5, color: '#8a7280', marginTop: 12, lineHeight: 1.6 }}>
              Al confirmar te mostraremos el número para pagar el monto exacto. Tu pedido se procesa cuando verifiquemos el pago.
            </p>
          </section>
        </div>

        <aside className="cart-summary">
          <div style={{ fontSize: 11, letterSpacing: '0.2em', marginBottom: 18 }}>TU PEDIDO</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
            {items.map((it) => (
              <div key={it.variantId} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 48, height: 60, overflow: 'hidden', flexShrink: 0, background: '#f6eef2' }}>
                  {it.image && <img src={it.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.4 }}>
                  {it.name}{it.label ? ` · ${it.label}` : ''}
                  <div style={{ color: '#8a7280' }}>x{it.qty}</div>
                </div>
                <div style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{formatPrice(it.unitPrice * it.qty)}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #ead7e0', paddingTop: 14 }}>
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label={`Envío${dept ? ` (${dept.name})` : ''}`} value={shipping != null ? formatPrice(shipping) : 'Elige departamento'} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-serif)', fontSize: 24, marginTop: 10 }}>
              <span>Total</span><span style={{ color: '#aa2159' }}>{formatPrice(total)}</span>
            </div>
          </div>
          {error && <div style={{ ...alertStyle('error'), marginTop: 16 }}>{error}</div>}
          <button type="submit" disabled={submitting} style={{ ...primaryButton(submitting), width: '100%', marginTop: 20 }}>
            {submitting ? 'REGISTRANDO PEDIDO...' : `CONFIRMAR PEDIDO · ${PAYMENT_METHODS.find((m) => m.id === payment).label.toUpperCase()}`}
          </button>
        </aside>
      </form>
    </main>
  );
}

function SectionTitle({ n, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
      <span style={{ width: 26, height: 26, borderRadius: 999, background: '#aa2159', color: '#fff', fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 28, margin: 0 }}>{title}</h2>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13.5, marginBottom: 8 }}>
      <span style={{ color: '#5a4450' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
