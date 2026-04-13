import NavBar from './NavBar';

export default function Layout({ children }) {
  return (
    <div className="page-shell">
      <NavBar />
      <main className="page-content">
        <div className="container" style={{ paddingTop: '1.75rem', paddingBottom: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
