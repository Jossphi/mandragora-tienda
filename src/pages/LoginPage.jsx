import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onNavigate('home');
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: email.split('@')[0] } // Default fallback name
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: '¡Registro exitoso! Revisa tu correo para confirmar.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-enter" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 40, background: '#fff', border: '1px solid #e6cdd8' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 36, margin: '0 0 20px', textAlign: 'center' }}>
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        
        {message && (
          <div style={{ padding: 12, marginBottom: 20, fontSize: 12, background: message.type === 'error' ? '#fde8e8' : '#e8fdf2', color: message.type === 'error' ? '#aa2159' : '#10b981' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', marginBottom: 6 }}>CORREO ELECTRÓNICO</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', fontSize: 14 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', marginBottom: 6 }}>CONTRASEÑA</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', fontSize: 14 }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: '#23161c', 
              color: '#fff', 
              padding: '16px', 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.15em',
              fontSize: 12,
              marginTop: 10,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'PROCESANDO...' : (isLogin ? 'INGRESAR' : 'REGISTRARSE')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12 }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aa2159', textDecoration: 'underline', letterSpacing: '0.05em' }}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </main>
  );
}
