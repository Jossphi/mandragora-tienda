import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../hooks/useProducts';
import { getPaymentMethod } from '../config/store';
import { StatusBadge } from './OrderPage';
import { labelStyle, inputStyle, primaryButton, secondaryButton, alertStyle, pageTitle } from '../components/ui/formStyles';

export default function AccountPage({ onNavigate }) {
  const { user, profile, loading: authLoading, refreshProfile, signOut } = useAuth();
  const [orders, setOrders] = useState(null);
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) onNavigate('login?next=account');
  }, [authLoading, user, onNavigate]);

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '' });
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('id, order_number, created_at, total_amount, payment_method, order_statuses ( code, label, color_hex ), order_items ( quantity )')
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const { error } = await supabase.from('profiles')
      .update({ full_name: form.full_name.trim(), phone: form.phone.trim() })
      .eq('id', user.id);
    setSaving(false);
    if (error) setMsg({ type: 'error', text: 'No pudimos guardar tus datos.' });
    else { setMsg({ type: 'success', text: 'Datos guardados.' }); refreshProfile(); }
  };

  const logout = async () => {
    await signOut();
    onNavigate('home');
  };

  if (authLoading || !user) {
    return <main style={{ padding: '100px 20px', textAlign: 'center', color: '#8a7280' }}>Cargando...</main>;
  }

  return (
    <main className="page-enter" style={{ maxWidth: 1180, margin: '0 auto', padding: '56px clamp(16px, 4vw, 40px) 40px' }}>
      <div style={{ fontSize: '10.5px', letterSpacing: '0.3em', color: '#8a5f73' }}>INICIO / MI CUENTA</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', margin: '14px 0 34px' }}>
        <h1 style={{ ...pageTitle, margin: 0 }}>Hola{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}</h1>
        <button onClick={logout} style={secondaryButton}>CERRAR SESIÓN</button>
      </div>

      <div className="cart-layout">
        <section>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', marginBottom: 14 }}>MIS PEDIDOS</div>
          {orders === null ? (
            <p style={{ color: '#8a7280', fontSize: 14 }}>Cargando pedidos...</p>
          ) : orders.length === 0 ? (
            <div style={{ padding: '34px 0', borderTop: '1px solid #f0dde5' }}>
              <p style={{ fontSize: 14, color: '#5a4450', fontWeight: 300, margin: '0 0 18px' }}>Todavía no tienes pedidos.</p>
              <button style={primaryButton()} onClick={() => onNavigate('joyeria')}>VER JOYERÍA</button>
            </div>
          ) : (
            orders.map((o) => {
              const items = o.order_items.reduce((s, i) => s + i.quantity, 0);
              return (
                <a
                  key={o.id}
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate(`order/${o.id}`); }}
                  className="order-row"
                >
                  <div>
                    <div style={{ fontSize: 15, color: '#23161c' }}>Pedido #{o.order_number}</div>
                    <div style={{ fontSize: 12.5, color: '#8a7280', marginTop: 3 }}>
                      {new Date(o.created_at).toLocaleDateString('es-PE', { dateStyle: 'medium' })} · {items} {items === 1 ? 'pieza' : 'piezas'} · {getPaymentMethod(o.payment_method)?.label}
                    </div>
                  </div>
                  <StatusBadge status={o.order_statuses || {}} />
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 19, color: '#23161c' }}>{formatPrice(o.total_amount)}</div>
                  <span style={{ color: '#aa2159', fontSize: 18 }}>›</span>
                </a>
              );
            })
          )}
        </section>

        <aside className="cart-summary">
          <div style={{ fontSize: 11, letterSpacing: '0.2em', marginBottom: 16 }}>MIS DATOS</div>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>CORREO</label>
              <input value={profile?.email || user.email} disabled style={{ ...inputStyle, background: '#f6eef2', color: '#8a7280' }} />
            </div>
            <div>
              <label style={labelStyle}>NOMBRE Y APELLIDO</label>
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CELULAR</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} inputMode="tel" />
            </div>
            {profile?.address && (
              <p style={{ fontSize: 12.5, color: '#8a7280', lineHeight: 1.6, margin: 0 }}>
                Dirección guardada: {profile.address}, {profile.district}. Se actualiza en cada compra.
              </p>
            )}
            {msg && <div style={alertStyle(msg.type)}>{msg.text}</div>}
            <button type="submit" disabled={saving} style={primaryButton(saving)}>{saving ? 'GUARDANDO...' : 'GUARDAR'}</button>
          </form>
        </aside>
      </div>
    </main>
  );
}
