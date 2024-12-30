import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Edit, Trash, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import { MaterialForm } from './MaterialForm';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { formatDate } from '../../utils/formatters';
import { ExcelImport } from './ExcelImport';

export function MateriaisPage() {
  const { materiais, setMateriais, projetos } = useApp();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();
  const [materialParaEditar, setMaterialParaEditar] = React.useState(null);
  const [materialParaDeletar, setMaterialParaDeletar] = React.useState(null);
  const [projetoSelecionado, setProjetoSelecionado] = useState('');
  const [busca, setBusca] = useState('');

  const handleEditarMaterial = (material) => {
    setMaterialParaEditar(material);
    openForm();
  };

  const handleDeletarMaterial = (material) => {
    setMaterialParaDeletar(material);
    openDelete();
  };

  const confirmarDelete = () => {
    setMateriais(materiais.filter(m => m.id !== materialParaDeletar.id));
    setMaterialParaDeletar(null);
    closeDelete();
  };

  const handleNovoMaterial = () => {
    setMaterialParaEditar(null);
    openForm();
  };

  // Filter materials based on search and selected project
  const materiaisFiltrados = materiais.filter(material => {
    const matchesBusca = 
      material.nome.toLowerCase().includes(busca.toLowerCase()) ||
      material.codigo.toLowerCase().includes(busca.toLowerCase());
    
    const matchesProjeto = !projetoSelecionado || material.projeto === projetoSelecionado;
    
    return matchesBusca && matchesProjeto;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Materiais</h1>
        <button
          onClick={handleNovoMaterial}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Novo Material
        </button>
      </div>

      <ExcelImport />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search field */}
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

        {/* Project selection */}
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projeto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Atualização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materiaisFiltrados.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {material.codigo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-blue-600 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {material.nome}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {material.quantidade} {material.unidade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {material.minimo} {material.unidade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {material.projeto}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {formatDate(material.ultimaAtualizacao)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {material.quantidade <= material.minimo ? (
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-yellow-600">
                          Estoque Baixo
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-green-600">
                        Estoque Normal
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditarMaterial(material)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletarMaterial(material)}
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
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Nenhum material encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MaterialForm
        isOpen={isFormOpen}
        onClose={closeForm}
        materialParaEditar={materialParaEditar}
      />

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