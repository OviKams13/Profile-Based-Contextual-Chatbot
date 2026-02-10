// Human-readable reference lets admissions and applicants discuss one profile identifier.
export function generateReferenceCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `APP-${timestamp}-${random}`;
}
