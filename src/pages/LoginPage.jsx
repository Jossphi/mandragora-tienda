import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { labelStyle, inputStyle, primaryButton, alertStyle } from '../components/ui/formStyles';

const ERRORS = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'Email not confirmed': 'Primero confirma tu correo: revisa tu bandeja de entrada (y spam).',
  'User already registered': 'Ya existe una cuenta con este correo. Inicia sesión.',
};
const translate = (msg) => ERRORS[msg] || (msg?.includes('Password should be') ? 'La contraseña debe tener al menos 6 caracteres.' : msg);

// mode: 'login' | 'register' | 'forgot' | 'reset'
export default function LoginPage({ onNavigate, next = 'account', initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password });
        if (error) throw error;
        onNavigate(next, { replace: true });
      } else if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: {
            emailRedirectTo: redirectTo,
            data: { full_name: form.full_name.trim(), phone: form.phone.trim() },
          },
        });
        if (error) throw error;
        if (data.session) {
          onNavigate(next, { replace: true });
        } else {
          setMessage({ type: 'success', text: `¡Cuenta creada! Te enviamos un correo a ${form.email.trim()} para confirmarla. Luego inicia sesión.` });
          setMode('login');
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim(), { redirectTo });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Si el correo está registrado, te enviamos un enlace para crear una nueva contraseña.' });
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.updateUser({ password: form.password });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Contraseña actualizada.' });
        onNavigate('account');
      }
    } catch (err) {
      setMessage({ type: 'error', text: translate(err.message) });
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: 'Iniciar sesión',
    register: 'Crear cuenta',
    forgot: 'Recuperar contraseña',
    reset: 'Nueva contraseña',
  };
  const buttons = { login: 'INGRESAR', register: 'CREAR CUENTA', forgot: 'ENVIAR ENLACE', reset: 'GUARDAR CONTRASEÑA' };
  const switchMode = (m) => { setMode(m); setMessage(null); };

  return (
    <main className="page-enter" style={{ minHeight: '78vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px 16px' }}>
      <div style={{ width: '100%', maxWidth: 430, padding: 'clamp(26px, 6vw, 44px)', background: '#fff', border: '1px solid #ead7e0' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 38, margin: '0 0 6px', textAlign: 'center' }}>
          {titles[mode]}
        </h1>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#8a7280', margin: '0 0 24px', fontWeight: 300 }}>
          {mode === 'register' ? 'Guarda tu carrito, compra más rápido y sigue tus pedidos.' :
            mode === 'login' && next === 'checkout' ? 'Inicia sesión para finalizar tu compra.' : ''}
        </p>

        {message && <div style={{ ...alertStyle(message.type), marginBottom: 18 }}>{message.text}</div>}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={labelStyle}>NOMBRE Y APELLIDO</label>
                <input required value={form.full_name} onChange={update('full_name')} style={inputStyle} autoComplete="name" />
              </div>
              <div>
                <label style={labelStyle}>CELULAR</label>
                <input required value={form.phone} onChange={update('phone')} style={inputStyle} inputMode="tel" autoComplete="tel" placeholder="987 654 321" />
              </div>
            </>
          )}
          {mode !== 'reset' && (
            <div>
              <label style={labelStyle}>CORREO ELECTRÓNICO</label>
              <input type="email" required value={form.email} onChange={update('email')} style={inputStyle} autoComplete="email" />
            </div>
          )}
          {mode !== 'forgot' && (
            <div>
              <label style={labelStyle}>{mode === 'reset' ? 'NUEVA CONTRASEÑA' : 'CONTRASEÑA'}</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={update('password')}
                style={inputStyle}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              {mode !== 'login' && <div style={{ fontSize: 11.5, color: '#8a7280', marginTop: 5 }}>Mínimo 6 caracteres.</div>}
            </div>
          )}
          {mode === 'login' && (
            <button type="button" onClick={() => switchMode('forgot')} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', fontSize: 12, color: '#8a5f73', cursor: 'pointer', padding: 0 }}>
              ¿Olvidaste tu contraseña?
            </button>
          )}
          <button type="submit" disabled={loading} style={{ ...primaryButton(loading), marginTop: 6 }}>
            {loading ? 'PROCESANDO...' : buttons[mode]}
          </button>
        </form>

        {mode !== 'reset' && (
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#5a4450' }}>
            {mode === 'login' ? (
              <>¿No tienes cuenta?{' '}<LinkBtn onClick={() => switchMode('register')}>Crear cuenta</LinkBtn></>
            ) : (
              <>¿Ya tienes cuenta?{' '}<LinkBtn onClick={() => switchMode('login')}>Inicia sesión</LinkBtn></>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function LinkBtn({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aa2159', textDecoration: 'underline', fontSize: 13, padding: 0 }}>
      {children}
    </button>
  );
}
