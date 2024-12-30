import { Transacao } from '../types';

export function useFinanceiro() {
  const calcularTotalReceitas = (transacoes: Transacao[]) => {
    return transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + t.valor, 0);
  };

  const calcularTotalDespesas = (transacoes: Transacao[]) => {
    return transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + t.valor, 0);
  };

  const calcularSaldo = (transacoes: Transacao[]) => {
    return calcularTotalReceitas(transacoes) - calcularTotalDespesas(transacoes);
  };

  const calcularSaldoProjeto = (transacoes: Transacao[], projeto: string) => {
    const transacoesProjeto = transacoes.filter(t => t.projeto === projeto);
    return calcularSaldo(transacoesProjeto);
  };

  const calcularTotalPorCategoria = (transacoes: Transacao[]) => {
    return transacoes.reduce((acc, transacao) => {
      const { categoria, valor } = transacao;
      acc[categoria] = (acc[categoria] || 0) + valor;
      return acc;
    }, {} as Record<string, number>);
  };

  return {
    calcularTotalReceitas,
    calcularTotalDespesas,
    calcularSaldo,
    calcularSaldoProjeto,
    calcularTotalPorCategoria
  };
}