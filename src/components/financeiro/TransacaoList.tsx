import React, { useState } from 'react';
import { Edit, Trash, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import { TransacaoForm } from './TransacaoForm';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { formatCurrency } from '../../utils/formatters';

export function TransacaoList() {
  const { transacoes, setTransacoes } = useApp();
  const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useModal();
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();
  const [transacaoParaEditar, setTransacaoParaEditar] = useState(null);
  const [transacaoParaDeletar, setTransacaoParaDeletar] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo: '',
    categoria: '',
    dataInicio: '',
    dataFim: ''
  });

  const handleEditarTransacao = (transacao) => {
    setTransacaoParaEditar(transacao);
    openEdit();
  };

  const handleDeletarTransacao = (transacao) => {
    setTransacaoParaDeletar(transacao);
    openDelete();
  };

  const confirmarDelete = () => {
    setTransacoes(transacoes.filter(t => t.id !== transacaoParaDeletar.id));
    setTransacaoParaDeletar(null);
    closeDelete();
  };

  const transacoesFiltradas = transacoes.filter(transacao => {
    if (filtros.tipo && transacao.tipo !== filtros.tipo) return false;
    if (filtros.categoria && transacao.categoria !== filtros.categoria) return false;
    if (filtros.dataInicio && transacao.data < filtros.dataInicio) return false;
    if (filtros.dataFim && transacao.data > filtros.dataFim) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transações</h2>
          <button
            onClick={() => document.getElementById('filtros')?.classList.toggle('hidden')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <Filter className="h-5 w-5" />
            Filtros
          </button>
        </div>

        <div id="filtros" className="hidden mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filtros.tipo}
            onChange={e => setFiltros({ ...filtros, tipo: e.target.value })}
            className="rounded-md border-gray-300"
          >
            <option value="">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>

          <select
            value={filtros.categoria}
            onChange={e => setFiltros({ ...filtros, categoria: e.target.value })}
            className="rounded-md border-gray-300"
          >
            <option value="">Todas as categorias</option>
            <option value="material">Material</option>
            <option value="mao_de_obra">Mão de Obra</option>
            <option value="equipamento">Equipamento</option>
            <option value="servico">Serviço</option>
            <option value="outros">Outros</option>
          </select>

          <input
            type="date"
            value={filtros.dataInicio}
            onChange={e => setFiltros({ ...filtros, dataInicio: e.target.value })}
            className="rounded-md border-gray-300"
            placeholder="Data inicial"
          />

          <input
            type="date"
            value={filtros.dataFim}
            onChange={e => setFiltros({ ...filtros, dataFim: e.target.value })}
            className="rounded-md border-gray-300"
            placeholder="Data final"
          />
        </div>

        <div className="space-y-4">
          {transacoesFiltradas.map((transacao) => (
            <div
              key={transacao.id}
              className="flex items-center justify-between p-4 border-b last:border-0"
            >
              <div>
                <p className="font-medium text-gray-800">{transacao.descricao}</p>
                <p className="text-sm text-gray-500">{transacao.projeto}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transacao.data).toLocaleDateString()}
                </p>
                <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {transacao.categoria}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <p className={`font-semibold ${
                  transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transacao.tipo === 'receita' ? '+' : '-'}
                  {formatCurrency(transacao.valor)}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditarTransacao(transacao)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeletarTransacao(transacao)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TransacaoForm
        isOpen={isEditOpen}
        onClose={() => {
          closeEdit();
          setTransacaoParaEditar(null);
        }}
        transacaoParaEditar={transacaoParaEditar}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={confirmarDelete}
        title="Deletar Transação"
        message="Tem certeza que deseja deletar esta transação? Esta ação não pode ser desfeita."
      />
    </div>
  );
}