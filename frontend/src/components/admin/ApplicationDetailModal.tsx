import { useEffect, useState } from 'react';
import { acceptApplication, getAdminApplication, rejectApplication } from '../../api/adminApplications';
import { getApiErrorMessage } from '../../api/http';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ApplicationDetailModal({ open, id, onClose, onReviewed }: { open: boolean; id: number | null; onClose: () => void; onReviewed: () => void }) {
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      if (!id || !open) return;
      try {
        setItem(await getAdminApplication(id));
      } catch (e) {
        setError(getApiErrorMessage(e));
      }
    }
    load();
  }, [id, open]);

  async function review(type: 'accept' | 'reject') {
    if (!id) return;
    try {
      if (type === 'accept') await acceptApplication(id);
      else await rejectApplication(id);
      onReviewed();
      onClose();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  return (
    <Modal open={open} title="Application Detail" onClose={onClose}>
      {error && <div className="error">{error}</div>}
      {!item && <p>Loading...</p>}
      {item && (
        <div>
          <p><b>Status:</b> {item.status}</p>
          <p><b>Program:</b> {item.program?.name}</p>
          <p><b>Applicant:</b> {item.applicant_profile?.first_name} {item.applicant_profile?.last_name}</p>
          <pre className="pre">{JSON.stringify(item.applicant_profile, null, 2)}</pre>
          <div className="row">
            <Button onClick={() => review('accept')}>Accept</Button>
            <Button onClick={() => review('reject')}>Reject</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
