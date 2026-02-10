import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function SidebarLayout() {
  const { logout } = useAuth();
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>Admin</h2>
        <Link to="/admin/programs">Programs</Link>
        <Link to="/admin/applications">Applications</Link>
        <button className="btn" onClick={logout}>Logout</button>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
