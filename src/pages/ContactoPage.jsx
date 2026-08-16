export default function ContactoPage() {
  return (
    <main className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '76px 40px 0' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 62, margin: '0 0 40px' }}>
        Contacto
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <input
            placeholder="Nombre"
            style={{
              border: 0,
              borderBottom: '1px solid #e6cdd8',
              background: 'transparent',
              padding: '14px 2px',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              outline: 'none',
              color: '#23161c',
            }}
          />
          <input
            type="email"
            placeholder="Correo"
            style={{
              border: 0,
              borderBottom: '1px solid #e6cdd8',
              background: 'transparent',
              padding: '14px 2px',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              outline: 'none',
              color: '#23161c',
            }}
          />
          <textarea
            placeholder="Cuéntanos qué buscas"
            rows={4}
            style={{
              border: 0,
              borderBottom: '1px solid #e6cdd8',
              background: 'transparent',
              padding: '14px 2px',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              outline: 'none',
              resize: 'none',
              color: '#23161c',
            }}
          />
          <button
            style={{
              display: 'inline-block',
              alignSelf: 'flex-start',
              background: '#23161c',
              color: '#fff',
              padding: '14px 40px',
              fontSize: 11,
              letterSpacing: '0.24em',
              marginTop: 10,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'background 200ms',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#aa2159'}
            onMouseOut={e => e.currentTarget.style.background = '#23161c'}
          >
            ENVIAR
          </button>
        </div>

        {/* Info */}
        <div style={{ fontSize: 14, lineHeight: 2, color: '#4a3742', fontWeight: 300 }}>
          <div style={{ fontSize: '10.5px', letterSpacing: '0.3em', color: '#aa2159', marginBottom: 14 }}>
            ATELIER
          </div>
          Av. La Mar 1234, Miraflores<br />
          Lima, Perú<br /><br />

          <div style={{ fontSize: '10.5px', letterSpacing: '0.3em', color: '#aa2159', marginBottom: 14 }}>
            HORARIO
          </div>
          Lun a Sáb · 11:00 – 20:00<br /><br />

          <div style={{ fontSize: '10.5px', letterSpacing: '0.3em', color: '#aa2159', marginBottom: 14 }}>
            WHATSAPP
          </div>
          +51 999 888 777
        </div>
      </div>
    </main>
  );
}
