import React from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import { TarefaForm } from './TarefaForm';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { StatusBadge } from '../shared/StatusBadge';
import { PriorityBadge } from '../shared/PriorityBadge';

export function KanbanPage() {
  const { tarefas, setTarefas } = useApp();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();
  const [tarefaParaEditar, setTarefaParaEditar] = React.useState(null);
  const [tarefaParaDeletar, setTarefaParaDeletar] = React.useState(null);

  const getTarefasPorStatus = (status: string) => {
    return tarefas.filter(tarefa => tarefa.status === status);
  };

  const handleEditarTarefa = (tarefa) => {
    setTarefaParaEditar(tarefa);
    openForm();
  };

  const handleDeletarTarefa = (tarefa) => {
    setTarefaParaDeletar(tarefa);
    openDelete();
  };

  const confirmarDelete = () => {
    setTarefas(tarefas.filter(t => t.id !== tarefaParaDeletar.id));
    setTarefaParaDeletar(null);
    closeDelete();
  };

  const handleNovaTarefa = () => {
    setTarefaParaEditar(null);
    openForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kanban</h1>
        <button
          onClick={handleNovaTarefa}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nova Tarefa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['pendente', 'em_progresso', 'em_revisao', 'concluido'].map((status) => (
          <div key={status} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {status === 'pendente' ? 'Pendente' :
               status === 'em_progresso' ? 'Em Progresso' :
               status === 'em_revisao' ? 'Em Revisão' : 'Concluído'}
            </h3>
            
            <div className="space-y-4">
              {getTarefasPorStatus(status).map((tarefa) => (
                <div
                  key={tarefa.id}
                  className="bg-white p-4 rounded-lg shadow cursor-move"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800">{tarefa.titulo}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditarTarefa(tarefa)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletarTarefa(tarefa)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{tarefa.projeto}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">{tarefa.responsavel}</span>
                    <PriorityBadge priority={tarefa.prioridade} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TarefaForm
        isOpen={isFormOpen}
        onClose={closeForm}
        tarefaParaEditar={tarefaParaEditar}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={confirmarDelete}
        title="Deletar Tarefa"
        message="Tem certeza que deseja deletar esta tarefa? Esta ação não pode ser desfeita."
      />
    </div>
  );
}