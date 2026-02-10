import { useEffect, useState } from 'react';
import { listAdminApplications } from '../../api/adminApplications';
import { getApiErrorMessage } from '../../api/http';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ApplicationDetailModal from '../../components/admin/ApplicationDetailModal';

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  async function load() {
    try {
      const data = await listAdminApplications({ status: status || undefined, search: search || undefined, page: 1, limit: 20 });
      setItems(data.items);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Applications</h2>
      {error && <div className="error">{error}</div>}
      <div className="row">
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All status</option>
          <option value="submitted">Submitted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </Select>
        <button className="btn" onClick={load}>Filter</button>
      </div>
      <table className="table">
        <thead><tr><th>Applicant</th><th>Program</th><th>Status</th><th>Created</th></tr></thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} onClick={() => setSelectedId(it.id)}>
              <td>{it.applicant?.first_name} {it.applicant?.last_name}</td>
              <td>{it.program?.name}</td>
              <td>{it.status}</td>
              <td>{new Date(it.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ApplicationDetailModal open={!!selectedId} id={selectedId} onClose={() => setSelectedId(null)} onReviewed={load} />
    </div>
  );
}
