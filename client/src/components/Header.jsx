// green bar across the top, search box slides in here later
export default function Header({ children }) {
  return (
    <header className="header">
      <span className="logo" aria-hidden="true">♪</span>
      {children}
    </header>
  );
}
