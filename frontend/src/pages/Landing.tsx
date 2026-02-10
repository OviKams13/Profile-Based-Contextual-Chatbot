import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div>
      <h1>UniApply</h1>
      <p>Minimal API integration frontend.</p>
      <div className="row">
        <Link className="btn" to="/admin/login">Admin Login</Link>
        <Link className="btn" to="/applicant/login">Applicant Login</Link>
        <Link className="btn" to="/programs">Browse Programs</Link>
      </div>
    </div>
  );
}
