import { Material, MovimentacaoEstoque } from '../types/material';

export function checkEstoqueAlert(material: Material, quantidade: number) {
  if (quantidade <= 0) {
    return {
      type: 'error' as const,
      message: 'Estoque zerado'
    };
  }
  
  if (quantidade <= material.minimo) {
    return {
      type: 'warning' as const,
      message: 'Estoque baixo'
    };
  }

  return {
    type: 'success' as const,
    message: 'Estoque normal'
  };
}

export function checkMovimentacaoAlert(movimentacao: MovimentacaoEstoque) {
  const hoje = new Date();
  const dataMovimentacao = new Date(movimentacao.data);
  const diffDias = Math.floor((hoje.getTime() - dataMovimentacao.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDias > 30) {
    return {
      type: 'info' as const,
      message: 'Movimentação antiga'
    };
  }

  return null;
}

export function checkPrazoAlert(dataFim: string) {
  const hoje = new Date();
  const prazo = new Date(dataFim);
  const diffDias = Math.floor((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDias < 0) {
    return {
      type: 'error' as const,
      message: 'Prazo vencido'
    };
  }

  if (diffDias <= 7) {
    return {
      type: 'warning' as const,
      message: 'Prazo próximo'
    };
  }

  return {
    type: 'success' as const,
    message: 'No prazo'
  };
}