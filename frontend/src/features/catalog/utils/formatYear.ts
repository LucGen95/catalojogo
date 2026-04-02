export function formatYear(value?: string): string {
  if (!value) {
    return 'Ano nao informado';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return String(date.getFullYear());
}
