import { useEffect, useState } from 'react';
import { Course, CoursePayload, createCourse, deleteCourse, listProgramCourses, updateCourse } from '../../api/courses';
import { getApiErrorMessage } from '../../api/http';
import Button from '../ui/Button';
import Input from '../ui/Input';

const empty: CoursePayload = {
  year_number: 1,
  course_name: '',
  course_code: '',
  credits: 3,
  theoretical_hours: 2,
  practical_hours: 2,
  distance_hours: 0,
  ects: 7.5,
  course_description: '',
};

export default function CoursesEditor({ programId, durationYears }: { programId: number; durationYears: number }) {
  const [items, setItems] = useState<Course[]>([]);
  const [form, setForm] = useState<CoursePayload>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      setItems(await listProgramCourses(programId));
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  useEffect(() => {
    load();
  }, [programId]);

  async function onSave() {
    try {
      setError('');
      if (form.year_number > durationYears) throw new Error('Year exceeds program duration');
      if (editingId) await updateCourse(editingId, form);
      else await createCourse(programId, form);
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  async function onDelete(id: number) {
    try {
      await deleteCourse(id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <h4>Add / Edit course</h4>
      <div className="grid-2">
        <Input type="number" value={form.year_number} onChange={(e) => setForm({ ...form, year_number: Number(e.target.value) })} placeholder="Year" />
        <Input value={form.course_name} onChange={(e) => setForm({ ...form, course_name: e.target.value })} placeholder="Course name" />
        <Input value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.target.value })} placeholder="Code" />
        <Input type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} placeholder="Credits" />
        <Input type="number" value={form.theoretical_hours} onChange={(e) => setForm({ ...form, theoretical_hours: Number(e.target.value) })} placeholder="Theo hours" />
        <Input type="number" value={form.practical_hours} onChange={(e) => setForm({ ...form, practical_hours: Number(e.target.value) })} placeholder="Practical hours" />
        <Input type="number" value={form.distance_hours} onChange={(e) => setForm({ ...form, distance_hours: Number(e.target.value) })} placeholder="Distance hours" />
        <Input type="number" value={form.ects} onChange={(e) => setForm({ ...form, ects: Number(e.target.value) })} placeholder="ECTS" />
      </div>
      <Input value={form.course_description} onChange={(e) => setForm({ ...form, course_description: e.target.value })} placeholder="Description" />
      <Button onClick={onSave}>{editingId ? 'Update Course' : 'Add Course'}</Button>

      <table className="table">
        <thead><tr><th>Year</th><th>Name</th><th>Code</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td>{c.year_number}</td>
              <td>{c.course_name}</td>
              <td>{c.course_code}</td>
              <td>
                <Button onClick={() => { setEditingId(c.id); setForm({ ...c, id: undefined, program_id: undefined } as unknown as CoursePayload); }}>Edit</Button>
                <Button onClick={() => onDelete(c.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
