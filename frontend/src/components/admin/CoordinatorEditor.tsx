import { useEffect, useState } from 'react';
import { assignCoordinator, Program } from '../../api/programs';
import { Coordinator, CoordinatorPayload, createCoordinator, getCoordinator, updateCoordinator } from '../../api/coordinators';
import { getApiErrorMessage } from '../../api/http';
import Input from '../ui/Input';
import Button from '../ui/Button';

const empty: CoordinatorPayload = {
  full_name: '',
  email: '',
  picture: '',
  telephone_number: '',
  nationality: '',
  academic_qualification: '',
  speciality: '',
  office_location: '',
  office_hours: '',
};

export default function CoordinatorEditor({ program, onDone }: { program: Program; onDone: () => void }) {
  const [coordinator, setCoordinator] = useState<Coordinator | null>(null);
  const [form, setForm] = useState<CoordinatorPayload>(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      if (!program.program_coordinator_id) return;
      try {
        const c = await getCoordinator(program.program_coordinator_id);
        setCoordinator(c);
        setForm({ ...c, id: undefined } as unknown as CoordinatorPayload);
      } catch (e) {
        setError(getApiErrorMessage(e));
      }
    }
    load();
  }, [program.program_coordinator_id]);

  async function save() {
    try {
      setError('');
      if (coordinator) {
        await updateCoordinator(coordinator.id, form);
      } else {
        const created = await createCoordinator(form);
        await assignCoordinator(program.id, created.id);
      }
      onDone();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  async function unassign() {
    try {
      await assignCoordinator(program.id, null);
      onDone();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="grid-2">
        <Input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input placeholder="Phone" value={form.telephone_number || ''} onChange={(e) => setForm({ ...form, telephone_number: e.target.value })} />
        <Input placeholder="Nationality" value={form.nationality || ''} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
        <Input placeholder="Academic qualification" value={form.academic_qualification || ''} onChange={(e) => setForm({ ...form, academic_qualification: e.target.value })} />
        <Input placeholder="Speciality" value={form.speciality || ''} onChange={(e) => setForm({ ...form, speciality: e.target.value })} />
        <Input placeholder="Office location" value={form.office_location || ''} onChange={(e) => setForm({ ...form, office_location: e.target.value })} />
        <Input placeholder="Office hours" value={form.office_hours || ''} onChange={(e) => setForm({ ...form, office_hours: e.target.value })} />
      </div>
      <Button onClick={save}>{coordinator ? 'Update Coordinator' : 'Create & Assign Coordinator'}</Button>
      {program.program_coordinator_id && <Button onClick={unassign}>Unassign</Button>}
    </div>
  );
}
