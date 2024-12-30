import React, { useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useModal } from '../../../hooks/useModal';
import { MovimentacaoForm } from './MovimentacaoForm';
import { ConfirmDialog } from '../../shared/ConfirmDialog';
import { formatDate } from '../../../utils/formatters';

export function MovimentacoesList() {
  const { materiais, movimentacoes, setMovimentacoes, estoque, setEstoque } = useApp();
  const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useModal();
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();
  const [movimentacaoParaEditar, setMovimentacaoParaEditar] = useState(null);
  const [movimentacaoParaDeletar, setMovimentacaoParaDeletar] = useState(null);

  const handleEditar = (movimentacao) => {
    setMovimentacaoParaEditar(movimentacao);
    openEdit();
  };

  const handleDeletar = (movimentacao) => {
    setMovimentacaoParaDeletar(movimentacao);
    openDelete();
  };

  const confirmarDelete = () => {
    // Reverte a movimentação no estoque
    const movimentacao = movimentacaoParaDeletar;
    const quantidade = movimentacao.tipo === 'entrada' ? -movimentacao.quantidade : movimentacao.quantidade;
    
    setEstoque(estoque.map(e => 
      e.materialId === movimentacao.materialId 
        ? { ...e, quantidade: e.quantidade + quantidade }
        : e
    ));

    // Remove a movimentação
    setMovimentacoes(movimentacoes.filter(m => m.id !== movimentacao.id));
    setMovimentacaoParaDeletar(null);
    closeDelete();
  };

  const movimentacoesComDetalhes = movimentacoes
    .map(mov => ({
      ...mov,
      material: materiais.find(m => m.id === mov.materialId)
    }))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Histórico de Movimentações</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projeto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nota Fiscal
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movimentacoesComDetalhes.map((mov) => (
              <tr key={mov.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(mov.data)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mov.material ? `${mov.material.codigo} - ${mov.material.nome}` : 'Material não encontrado'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    mov.tipo === 'entrada' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mov.quantidade} {mov.material?.unidade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mov.projeto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mov.responsavel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mov.notaFiscal || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditar(mov)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletar(mov)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {movimentacoesComDetalhes.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  Nenhuma movimentação encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MovimentacaoForm
        isOpen={isEditOpen}
        onClose={() => {
          closeEdit();
          setMovimentacaoParaEditar(null);
        }}
        movimentacaoParaEditar={movimentacaoParaEditar}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={confirmarDelete}
        title="Deletar Movimentação"
        message="Tem certeza que deseja deletar esta movimentação? Esta ação irá reverter o impacto no estoque."
      />
    </div>
  );
}