import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listPrograms, Program } from '../../api/programs';
import { getApiErrorMessage } from '../../api/http';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useAuth } from '../../auth/AuthContext';

export default function ApplicantProgramsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<Program[]>([]);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    listPrograms().then((d) => setItems(d.items)).catch((e) => setError(getApiErrorMessage(e)));
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => !level || p.level === level)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, level, search]);

  return (
    <div>
      <h2>Programs</h2>
      {error && <div className="error">{error}</div>}
      <div className="row">
        <Input placeholder="Search program" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All levels</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="postgraduate">Postgraduate</option>
        </Select>
      </div>
      <div className="cards">
        {filtered.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.level} · {p.duration_years} years</p>
            <p>{p.short_description}</p>
            <div className="row">
              <Link className="btn" to={`/programs/${p.id}`}>Details</Link>
              <Button onClick={() => {
                if (user?.role === 'applicant') navigate(`/apply/${p.id}`);
                else navigate('/applicant/login');
              }}>Apply</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
