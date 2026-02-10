import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import { getApiErrorMessage } from '../../api/http';
import { useAuth } from '../../auth/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ApplicantSignup() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const data = await register({ ...form, role: 'applicant' });
      setAuth(data.token, data.user);
      navigate('/programs');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <div>
      <h2>Applicant Signup</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <Input placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <Input placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
}
