import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function SimpleLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div>
      <header className="topbar">
        <Link to="/">UniApply</Link>
        <nav>
          <Link to="/programs">Programs</Link>
          {user?.role === 'applicant' && <Link to="/me/applications">My Applications</Link>}
          {!user && <Link to="/applicant/login">Applicant Login</Link>}
          {!user && <Link to="/admin/login">Admin Login</Link>}
          {user && <button className="btn" onClick={logout}>Logout</button>}
        </nav>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
