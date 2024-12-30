import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Projeto, Tarefa, Membro, Material, Transacao, Etapa, Orcamento } from '../types';
import { MovimentacaoEstoque, EstoqueMaterial } from '../types/material';

interface AppContextData {
  projetos: Projeto[];
  setProjetos: (projetos: Projeto[]) => void;
  tarefas: Tarefa[];
  setTarefas: (tarefas: Tarefa[]) => void;
  membros: Membro[];
  setMembros: (membros: Membro[]) => void;
  materiais: Material[];
  setMateriais: (materiais: Material[]) => void;
  transacoes: Transacao[];
  setTransacoes: (transacoes: Transacao[]) => void;
  etapas: Etapa[];
  setEtapas: (etapas: Etapa[]) => void;
  orcamentos: Orcamento[];
  setOrcamentos: (orcamentos: Orcamento[]) => void;
  movimentacoes: MovimentacaoEstoque[];
  setMovimentacoes: (movimentacoes: MovimentacaoEstoque[]) => void;
  estoque: EstoqueMaterial[];
  setEstoque: (estoque: EstoqueMaterial[]) => void;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

// Dados iniciais para demonstração
const dadosIniciais = {
  projetos: [
    {
      id: '1',
      nome: 'Residencial Vista Verde',
      cliente: 'Construtora ABC',
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      orcamento: 1500000,
      status: 'em_andamento',
      descricao: 'Construção de condomínio residencial'
    }
  ],
  membros: [
    {
      id: '1',
      nome: 'João Silva',
      cargo: 'Engenheiro Civil',
      email: 'joao@exemplo.com',
      telefone: '11999887766',
      projetos: ['Residencial Vista Verde'],
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150'
    }
  ],
  orcamentos: []
} as const;

export function AppProvider({ children }: { children: ReactNode }) {
  const [projetos, setProjetos] = useLocalStorage<Projeto[]>('projetos', dadosIniciais.projetos);
  const [tarefas, setTarefas] = useLocalStorage<Tarefa[]>('tarefas', []);
  const [membros, setMembros] = useLocalStorage<Membro[]>('membros', dadosIniciais.membros);
  const [materiais, setMateriais] = useLocalStorage<Material[]>('materiais', []);
  const [transacoes, setTransacoes] = useLocalStorage<Transacao[]>('transacoes', []);
  const [etapas, setEtapas] = useLocalStorage<Etapa[]>('etapas', []);
  const [orcamentos, setOrcamentos] = useLocalStorage<Orcamento[]>('orcamentos', dadosIniciais.orcamentos);
  const [movimentacoes, setMovimentacoes] = useLocalStorage<MovimentacaoEstoque[]>('movimentacoes', []);
  const [estoque, setEstoque] = useLocalStorage<EstoqueMaterial[]>('estoque', []);

  return (
    <AppContext.Provider value={{
      projetos,
      setProjetos,
      tarefas,
      setTarefas,
      membros,
      setMembros,
      materiais,
      setMateriais,
      transacoes,
      setTransacoes,
      etapas,
      setEtapas,
      orcamentos,
      setOrcamentos,
      movimentacoes,
      setMovimentacoes,
      estoque,
      setEstoque
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}