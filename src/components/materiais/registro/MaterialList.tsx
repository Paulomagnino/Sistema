import React, { useState } from 'react';
import { Edit, Trash, Search } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useModal } from '../../../hooks/useModal';
import { ConfirmDialog } from '../../shared/ConfirmDialog';
import { formatDate } from '../../../utils/formatters';

export function MaterialList() {
  const { materiais, setMateriais, projetos } = useApp();
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();
  const [materialParaDeletar, setMaterialParaDeletar] = useState(null);
  const [projetoSelecionado, setProjetoSelecionado] = useState('');
  const [busca, setBusca] = useState('');

  const handleDeletar = (material) => {
    setMaterialParaDeletar(material);
    openDelete();
  };

  const confirmarDelete = () => {
    setMateriais(materiais.filter(m => m.id !== materialParaDeletar.id));
    setMaterialParaDeletar(null);
    closeDelete();
  };

  const materiaisFiltrados = materiais.filter(material => {
    const matchesBusca = 
      material.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      material.nome.toLowerCase().includes(busca.toLowerCase());
    
    const matchesProjeto = !projetoSelecionado || material.projeto === projetoSelecionado;
    
    return matchesBusca && matchesProjeto;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código ou nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <select
            value={projetoSelecionado}
            onChange={(e) => setProjetoSelecionado(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos os Projetos</option>
            {projetos.map(projeto => (
              <option key={projeto.id} value={projeto.nome}>
                {projeto.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projeto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Atualização
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materiaisFiltrados.map((material) => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {material.codigo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {material.nome}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {material.categoria}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {material.unidade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {material.projeto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(material.ultimaAtualizacao)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleDeletar(material)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {materiaisFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Nenhum material encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={confirmarDelete}
        title="Deletar Material"
        message="Tem certeza que deseja deletar este material? Esta ação não pode ser desfeita."
      />
    </div>
  );
}