export interface Material {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  unidade: string;
  minimo: number;
  categoria: string;
  fornecedor?: string;
  projeto: string;
  ultimaAtualizacao: string;
}

export interface MovimentacaoEstoque {
  id: string;
  materialId: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data: string;
  projeto: string;
  responsavel: string;
  notaFiscal?: string;
  observacao?: string;
}

export interface EstoqueMaterial {
  id: string;
  materialId: string;
  quantidade: number;
  ultimaAtualizacao: string;
}