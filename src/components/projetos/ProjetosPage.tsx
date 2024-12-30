import React from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import { ProjetoForm } from './ProjetoForm';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../shared/StatusBadge';

export function ProjetosPage() {
  const { projetos, setProjetos } = useApp();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();
  const [projetoParaEditar, setProjetoParaEditar] = React.useState(null);
  const [projetoParaDeletar, setProjetoParaDeletar] = React.useState(null);

  const handleEditarProjeto = (projeto) => {
    setProjetoParaEditar(projeto);
    openForm();
  };

  const handleDeletarProjeto = (projeto) => {
    setProjetoParaDeletar(projeto);
    openDelete();
  };

  const confirmarDelete = () => {
    setProjetos(projetos.filter(p => p.id !== projetoParaDeletar.id));
    setProjetoParaDeletar(null);
    closeDelete();
  };

  const handleNovoProjeto = () => {
    setProjetoParaEditar(null);
    openForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Projetos</h1>
        <button
          onClick={handleNovoProjeto}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Novo Projeto
        </button>
      </div>

      <div className="grid gap-6">
        {projetos.map((projeto) => (
          <div key={projeto.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{projeto.nome}</h3>
                <p className="text-gray-600 mt-1">{projeto.cliente}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditarProjeto(projeto)}
                  className="p-2 text-gray-600 hover:text-blue-600"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeletarProjeto(projeto)}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Período</p>
                <p className="text-gray-700">
                  {formatDate(projeto.dataInicio)} - {formatDate(projeto.dataFim)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Orçamento</p>
                <p className="text-gray-700">{formatCurrency(projeto.orcamento)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <StatusBadge status={projeto.status} />
              </div>
            </div>
            
            <p className="mt-4 text-gray-600">{projeto.descricao}</p>
          </div>
        ))}
      </div>

      <ProjetoForm
        isOpen={isFormOpen}
        onClose={() => {
          closeForm();
          setProjetoParaEditar(null);
        }}
        projetoParaEditar={projetoParaEditar}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={confirmarDelete}
        title="Deletar Projeto"
        message="Tem certeza que deseja deletar este projeto? Esta ação não pode ser desfeita."
      />
    </div>
  );
}