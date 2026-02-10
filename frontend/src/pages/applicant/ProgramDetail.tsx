import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProgram, Program } from '../../api/programs';
import { Course, listProgramCourses } from '../../api/courses';
import { Coordinator, getCoordinator } from '../../api/coordinators';
import { getApiErrorMessage } from '../../api/http';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coordinator, setCoordinator] = useState<Coordinator | null>(null);
  const [active, setActive] = useState('about');
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!id) return;
        const p = await getProgram(Number(id));
        setProgram(p);
        const list = await listProgramCourses(Number(id));
        setCourses(list);
        if (p.program_coordinator_id) {
          const c = await getCoordinator(p.program_coordinator_id);
          setCoordinator(c);
        }
      } catch (e) {
        setError(getApiErrorMessage(e));
      }
    }
    load();
  }, [id]);

  const grouped = useMemo(() => {
    return courses.reduce<Record<number, Course[]>>((acc, c) => {
      acc[c.year_number] = [...(acc[c.year_number] || []), c];
      return acc;
    }, {});
  }, [courses]);

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {!program && <p>Loading...</p>}
      {program && (
        <>
          <h2>{program.name}</h2>
          <Tabs
            active={active}
            onChange={setActive}
            tabs={[
              { key: 'about', label: 'About' },
              { key: 'curriculum', label: 'Curriculum' },
              { key: 'entry', label: 'Entry Requirements' },
              { key: 'fees', label: 'Fees & Scholarships' },
              { key: 'coord', label: 'Coordinator Information' },
            ]}
          />
          {active === 'about' && <p>{program.about_text}</p>}
          {active === 'entry' && <p>{program.entry_requirements_text}</p>}
          {active === 'fees' && <p>{program.scholarships_text}</p>}
          {active === 'curriculum' && (
            <div>
              {Object.keys(grouped).sort((a, b) => Number(a) - Number(b)).map((year) => (
                <div key={year}>
                  <h4>Year {year}</h4>
                  <ul>
                    {grouped[Number(year)].map((c) => (
                      <li key={c.id}>
                        <button className="link-btn" onClick={() => setSelectedCourse(c)}>{c.course_code} - {c.course_name}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {active === 'coord' && (
            <div>
              {!coordinator && <p>No coordinator assigned</p>}
              {coordinator && <pre className="pre">{JSON.stringify(coordinator, null, 2)}</pre>}
            </div>
          )}
          <Button onClick={() => navigate(`/apply/${program.id}`)}>Apply</Button>
          <Modal open={!!selectedCourse} title="Course" onClose={() => setSelectedCourse(null)}>
            {selectedCourse && <pre className="pre">{JSON.stringify(selectedCourse, null, 2)}</pre>}
          </Modal>
        </>
      )}
    </div>
  );
}
