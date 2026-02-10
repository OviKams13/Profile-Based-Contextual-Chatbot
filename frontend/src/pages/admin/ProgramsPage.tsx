import { useEffect, useState } from 'react';
import { listPrograms, Program } from '../../api/programs';
import { getApiErrorMessage } from '../../api/http';
import Button from '../../components/ui/Button';
import ProgramModalStepper from '../../components/admin/ProgramModalStepper';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Program | null>(null);

  async function load() {
    try {
      const data = await listPrograms();
      setPrograms(data.items);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Programs Management</h2>
      {error && <div className="error">{error}</div>}
      <Button onClick={() => { setSelected(null); setOpen(true); }}>+ Add Program</Button>
      <table className="table">
        <thead><tr><th>Name</th><th>Level</th><th>Duration</th><th>Description</th><th /></tr></thead>
        <tbody>
          {programs.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td><td>{p.level}</td><td>{p.duration_years}</td><td>{p.short_description}</td>
              <td><Button onClick={() => { setSelected(p); setOpen(true); }}>Edit</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProgramModalStepper open={open} initial={selected} onClose={() => setOpen(false)} onSaved={load} />
    </div>
  );
}
