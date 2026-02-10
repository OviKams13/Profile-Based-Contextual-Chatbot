import { useState } from 'react';
import { Program, ProgramPayload, createProgram, updateProgram } from '../../api/programs';
import { getApiErrorMessage } from '../../api/http';
import Modal from '../ui/Modal';
import Stepper from '../ui/Stepper';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import CoursesEditor from './CoursesEditor';
import CoordinatorEditor from './CoordinatorEditor';

const empty: ProgramPayload = {
  name: '',
  level: 'undergraduate',
  duration_years: 4,
  short_description: '',
  about_text: '',
  entry_requirements_text: '',
  scholarships_text: '',
};

export default function ProgramModalStepper({ open, initial, onClose, onSaved }: { open: boolean; initial?: Program | null; onClose: () => void; onSaved: () => void }) {
  const [step, setStep] = useState(0);
  const [program, setProgram] = useState<Program | null>(initial || null);
  const [form, setForm] = useState<ProgramPayload>(initial ? {
    name: initial.name,
    level: initial.level,
    duration_years: initial.duration_years,
    short_description: initial.short_description,
    about_text: initial.about_text,
    entry_requirements_text: initial.entry_requirements_text,
    scholarships_text: initial.scholarships_text,
  } : empty);
  const [error, setError] = useState('');

  async function saveProgramAndNext() {
    try {
      setError('');
      const data = initial?.id ? await updateProgram(initial.id, form) : await createProgram(form);
      setProgram(data);
      setStep(1);
      onSaved();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  const steps = ['Program Info', 'Courses', 'Coordinator'];

  return (
    <Modal open={open} title="Program Stepper" onClose={onClose}>
      {error && <div className="error">{error}</div>}
      <Stepper steps={steps} current={step} />
      {step === 0 && (
        <div>
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as ProgramPayload['level'] })}>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
          </Select>
          <Input type="number" placeholder="Duration years" value={form.duration_years} onChange={(e) => setForm({ ...form, duration_years: Number(e.target.value) })} />
          <Input placeholder="Short description" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
          <Input placeholder="About" value={form.about_text} onChange={(e) => setForm({ ...form, about_text: e.target.value })} />
          <Input placeholder="Entry requirements" value={form.entry_requirements_text} onChange={(e) => setForm({ ...form, entry_requirements_text: e.target.value })} />
          <Input placeholder="Scholarships" value={form.scholarships_text} onChange={(e) => setForm({ ...form, scholarships_text: e.target.value })} />
          <Button onClick={saveProgramAndNext}>Save & Next</Button>
        </div>
      )}
      {step === 1 && program && (
        <div>
          <CoursesEditor programId={program.id} durationYears={program.duration_years} />
          <Button onClick={() => setStep(2)}>Save & Next</Button>
        </div>
      )}
      {step === 2 && program && (
        <div>
          <CoordinatorEditor program={program} onDone={() => { onSaved(); onClose(); }} />
          <Button onClick={() => { onSaved(); onClose(); }}>Finish</Button>
        </div>
      )}
    </Modal>
  );
}
