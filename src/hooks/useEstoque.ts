import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EstoqueMaterial, MovimentacaoEstoque } from '../types/material';

export function useEstoque() {
  const { materiais } = useApp();
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [estoque, setEstoque] = useState<EstoqueMaterial[]>([]);

  // Calcula o saldo atual do estoque baseado nas movimentações
  const calcularSaldoEstoque = () => {
    const saldos = new Map<string, number>();

    movimentacoes.forEach(mov => {
      const saldoAtual = saldos.get(mov.materialId) || 0;
      const quantidade = mov.tipo === 'entrada' ? mov.quantidade : -mov.quantidade;
      saldos.set(mov.materialId, saldoAtual + quantidade);
    });

    return Array.from(saldos.entries()).map(([materialId, quantidade]) => ({
      id: materialId,
      materialId,
      quantidade,
      ultimaAtualizacao: new Date().toISOString()
    }));
  };

  // Atualiza o estoque quando houver mudanças nas movimentações
  useEffect(() => {
    setEstoque(calcularSaldoEstoque());
  }, [movimentacoes]);

  const adicionarMovimentacao = (movimentacao: MovimentacaoEstoque) => {
    setMovimentacoes(prev => [...prev, { ...movimentacao, id: crypto.randomUUID() }]);
  };

  const removerMovimentacao = (id: string) => {
    setMovimentacoes(prev => prev.filter(mov => mov.id !== id));
  };

  const getEstoqueMaterial = (materialId: string): EstoqueMaterial | undefined => {
    return estoque.find(e => e.materialId === materialId);
  };

  return {
    movimentacoes,
    estoque,
    adicionarMovimentacao,
    removerMovimentacao,
    getEstoqueMaterial
  };
}