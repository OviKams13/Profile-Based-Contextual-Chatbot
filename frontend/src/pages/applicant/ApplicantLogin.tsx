import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { getApiErrorMessage } from '../../api/http';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ApplicantLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const user = await login(email, password);
      navigate(user.role === 'dean' ? '/admin' : '/programs');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <div>
      <h2>Applicant Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
