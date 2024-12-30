export const CATEGORIAS_TRANSACAO = [
  'material',
  'mao_de_obra',
  'equipamento',
  'servico',
  'outros'
] as const;

export const CORES_GRAFICO = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const STATUS_CORES = {
  pendente: 'bg-yellow-100 text-yellow-800',
  em_andamento: 'bg-blue-100 text-blue-800',
  em_progresso: 'bg-blue-100 text-blue-800',
  concluido: 'bg-green-100 text-green-800',
  atrasado: 'bg-red-100 text-red-800',
  em_revisao: 'bg-purple-100 text-purple-800'
} as const;