import React from 'react';
import { Plus, Mail, Phone, Edit, Trash } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import { MembroForm } from './MembroForm';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { formatPhone } from '../../utils/formatters';

export function EquipePage() {
  const { membros, setMembros } = useApp();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();
  const [membroParaEditar, setMembroParaEditar] = React.useState(null);
  const [membroParaDeletar, setMembroParaDeletar] = React.useState(null);

  const handleEditarMembro = (membro) => {
    setMembroParaEditar(membro);
    openForm();
  };

  const handleDeletarMembro = (membro) => {
    setMembroParaDeletar(membro);
    openDelete();
  };

  const confirmarDelete = () => {
    setMembros(membros.filter(m => m.id !== membroParaDeletar.id));
    setMembroParaDeletar(null);
    closeDelete();
  };

  const handleNovoMembro = () => {
    setMembroParaEditar(null);
    openForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Equipe</h1>
        <button
          onClick={handleNovoMembro}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Novo Membro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {membros.map((membro) => (
          <div key={membro.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={membro.foto}
                    alt={membro.nome}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{membro.nome}</h3>
                    <p className="text-gray-600">{membro.cargo}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditarMembro(membro)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeletarMembro(membro)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{membro.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{formatPhone(membro.telefone)}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Projetos Ativos:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {membro.projetos.map((projeto) => (
                    <span
                      key={projeto}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {projeto}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MembroForm
        isOpen={isFormOpen}
        onClose={closeForm}
        membroParaEditar={membroParaEditar}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={confirmarDelete}
        title="Deletar Membro"
        message="Tem certeza que deseja deletar este membro da equipe? Esta ação não pode ser desfeita."
      />
    </div>
  );
}