export function trimString(value: string): string {
  return value.trim();
}

export function normalizeCourseInput<T extends { course_name: string; course_code: string; course_description: string }>(
  input: T,
): T {
  return {
    ...input,
    course_name: trimString(input.course_name),
    course_code: trimString(input.course_code).toUpperCase(),
    course_description: trimString(input.course_description),
  };
}
