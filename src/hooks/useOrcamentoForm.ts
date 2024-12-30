import { useState, useEffect } from 'react';
import { Orcamento, OrcamentoItem, Transacao } from '../types';
import { useApp } from '../context/AppContext';

const itemInicial: OrcamentoItem = {
  id: '',
  descricao: '',
  quantidade: 1,
  valorUnitario: 0,
  categoria: 'material'
};

const orcamentoInicial = (projetoId: string): Omit<Orcamento, 'itens'> => ({
  id: '',
  projetoId,
  valor: 0,
  data: new Date().toISOString().split('T')[0],
  status: 'pendente',
  observacoes: '',
  pago: false,
  dataPagamento: new Date().toISOString().split('T')[0]
});

export function useOrcamentoForm(
  projetoId: string, 
  orcamentoParaEditar?: Orcamento | null,
  isOpen?: boolean
) {
  const { orcamentos, setOrcamentos, transacoes, setTransacoes, projetos } = useApp();
  const [formData, setFormData] = useState<Omit<Orcamento, 'itens'>>(() => 
    orcamentoParaEditar ? {
      ...orcamentoParaEditar,
      dataPagamento: orcamentoParaEditar.dataPagamento || new Date().toISOString().split('T')[0]
    } : orcamentoInicial(projetoId)
  );
  const [itens, setItens] = useState<OrcamentoItem[]>(() => 
    orcamentoParaEditar?.itens || []
  );

  useEffect(() => {
    if (orcamentoParaEditar) {
      setFormData({
        ...orcamentoParaEditar,
        dataPagamento: orcamentoParaEditar.dataPagamento || new Date().toISOString().split('T')[0]
      });
      setItens(orcamentoParaEditar.itens);
    } else {
      setFormData(orcamentoInicial(projetoId));
      setItens([]);
    }
  }, [orcamentoParaEditar, projetoId, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ 
        ...prev, 
        [name]: checked,
        ...(checked && { dataPagamento: prev.dataPagamento || new Date().toISOString().split('T')[0] })
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const adicionarItem = () => {
    const novoItem = { ...itemInicial, id: crypto.randomUUID() };
    setItens(prev => [...prev, novoItem]);
  };

  const removerItem = (id: string) => {
    setItens(prev => prev.filter(item => item.id !== id));
  };

  const atualizarItem = (id: string, campo: keyof OrcamentoItem, valor: any) => {
    setItens(prev => prev.map(item => 
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => 
      total + (item.quantidade * item.valorUnitario), 0
    );
  };

  const encontrarTransacaoDoOrcamento = (orcamentoId: string): Transacao | undefined => {
    return transacoes.find(t => t.referencia === orcamentoId);
  };

  const criarOuAtualizarTransacao = (orcamento: Orcamento) => {
    const projeto = projetos.find(p => p.id === orcamento.projetoId);
    if (!projeto) return;

    // Usa a categoria do primeiro item do orçamento
    const categoria = orcamento.itens[0]?.categoria || 'outros';

    const transacaoExistente = encontrarTransacaoDoOrcamento(orcamento.id);
    const novaTransacao: Transacao = {
      id: transacaoExistente?.id || crypto.randomUUID(),
      tipo: 'despesa',
      valor: orcamento.valor,
      data: orcamento.dataPagamento || orcamento.data,
      descricao: `Pagamento de orçamento - ${orcamento.observacoes || 'Sem descrição'}`,
      projeto: projeto.nome,
      categoria, // Usa a categoria do item
      referencia: orcamento.id
    };

    if (transacaoExistente) {
      setTransacoes(prev => prev.map(t => 
        t.referencia === orcamento.id ? novaTransacao : t
      ));
    } else {
      setTransacoes(prev => [...prev, novaTransacao]);
    }
  };

  const removerTransacao = (orcamentoId: string) => {
    setTransacoes(prev => prev.filter(t => t.referencia !== orcamentoId));
  };

  const salvarOrcamento = () => {
    const novoOrcamento = {
      ...formData,
      id: orcamentoParaEditar?.id || crypto.randomUUID(),
      valor: calcularTotal(),
      itens
    };

    if (orcamentoParaEditar) {
      setOrcamentos(prev => prev.map(o => 
        o.id === novoOrcamento.id ? novoOrcamento : o
      ));
    } else {
      setOrcamentos(prev => [...prev, novoOrcamento]);
    }

    if (novoOrcamento.pago) {
      criarOuAtualizarTransacao(novoOrcamento);
    } else {
      removerTransacao(novoOrcamento.id);
    }

    return novoOrcamento;
  };

  return {
    formData,
    itens,
    handleChange,
    adicionarItem,
    removerItem,
    atualizarItem,
    calcularTotal,
    salvarOrcamento
  };
}