export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
  
  if (seconds < 60) return 'agora mesmo';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos atrás`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} horas atrás`;
  return `${Math.floor(seconds / 86400)} dias atrás`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}