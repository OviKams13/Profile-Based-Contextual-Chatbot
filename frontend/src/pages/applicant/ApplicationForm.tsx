import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApplicantProfilePayload, getApplicantProfile, submitApplication } from '../../api/applications';
import { getApiErrorMessage } from '../../api/http';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const empty: ApplicantProfilePayload = {
  first_name: '', last_name: '', date_of_birth: '', gender: '', passport_no: '', id_no: '',
  place_of_birth: '', contact_number: '', country: '', address_line: '', city: '', state: '', zip_postcode: '',
  mother_full_name: '', father_full_name: '', heard_about_university: '',
};

export default function ApplicationForm() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<ApplicantProfilePayload>(empty);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getApplicantProfile().then((p) => setForm({ ...empty, ...p })).catch(() => undefined);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await submitApplication(Number(programId), form);
      setMessage('Application submitted');
      setTimeout(() => navigate('/me/applications'), 800);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <div>
      <h2>Continue Application</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <form onSubmit={onSubmit} className="form">
        {Object.entries(form).map(([k, v]) => (
          <Input key={k} placeholder={k} value={v} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <Button type="submit">Submit Application</Button>
      </form>
    </div>
  );
}
