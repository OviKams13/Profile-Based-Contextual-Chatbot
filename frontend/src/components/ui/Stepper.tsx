export default function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="stepper">
      {steps.map((s, idx) => (
        <div key={s} className={`step ${idx === current ? 'active' : ''}`}>{idx + 1}. {s}</div>
      ))}
    </div>
  );
}
