export default function AlivePage() {
  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#22c55e',
      fontFamily: 'monospace',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>🟢 SERVICE ALIVE</h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
          RoadFit AI Server is active and responding.
        </p>
      </div>
    </main>
  );
}
