import { useEffect, useState } from 'react';
import { getMyApplications } from '../../api/applications';
import { getApiErrorMessage } from '../../api/http';

export default function MyApplications() {
  const [items, setItems] = useState<Array<{ id: number; status: string; created_at: string; program: { name: string } }>>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyApplications().then((d) => setItems(d.items)).catch((e) => setError(getApiErrorMessage(e)));
  }, []);

  return (
    <div>
      <h2>My Applications</h2>
      {error && <div className="error">{error}</div>}
      <table className="table">
        <thead><tr><th>Program</th><th>Status</th><th>Created</th></tr></thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}><td>{it.program.name}</td><td>{it.status}</td><td>{new Date(it.created_at).toLocaleString()}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
