export function truncateText(value?: string, maxLength = 110): string {
  if (!value) {
    return 'Sem descricao cadastrada ainda.';
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}
