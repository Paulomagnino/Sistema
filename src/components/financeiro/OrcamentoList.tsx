import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import { OrcamentoCard } from './OrcamentoCard';
import { OrcamentoForm } from './OrcamentoForm';
import { ConfirmDialog } from '../shared/ConfirmDialog';

export function OrcamentoList() {
  const { projetos, orcamentos, setOrcamentos } = useApp();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();
  const [projetoSelecionado, setProjetoSelecionado] = useState('');
  const [orcamentoParaEditar, setOrcamentoParaEditar] = useState(null);
  const [orcamentoParaDeletar, setOrcamentoParaDeletar] = useState(null);

  const handleNovo = (projetoId: string) => {
    setProjetoSelecionado(projetoId);
    setOrcamentoParaEditar(null);
    openForm();
  };

  const handleEditar = (orcamento) => {
    setOrcamentoParaEditar(orcamento);
    setProjetoSelecionado(orcamento.projetoId);
    openForm();
  };

  const handleDeletar = (orcamento) => {
    setOrcamentoParaDeletar(orcamento);
    openDelete();
  };

  const confirmarDelete = () => {
    setOrcamentos(orcamentos.filter(o => o.id !== orcamentoParaDeletar.id));
    setOrcamentoParaDeletar(null);
    closeDelete();
  };

  return (
    <div className="space-y-6">
      {projetos.map(projeto => {
        const orcamentosProjeto = orcamentos.filter(o => o.projetoId === projeto.id);
        
        return (
          <div key={projeto.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">{projeto.nome}</h2>
              <button
                onClick={() => handleNovo(projeto.id)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Novo Orçamento
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orcamentosProjeto.map(orcamento => (
                  <OrcamentoCard
                    key={orcamento.id}
                    orcamento={orcamento}
                    projeto={projeto.nome}
                    onEdit={() => handleEditar(orcamento)}
                    onDelete={() => handleDeletar(orcamento)}
                  />
                ))}
              </div>
              
              {orcamentosProjeto.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum orçamento cadastrado para este projeto.
                </p>
              )}
            </div>
          </div>
        );
      })}

      <OrcamentoForm
        isOpen={isFormOpen}
        onClose={closeForm}
        projetoId={projetoSelecionado}
        orcamentoParaEditar={orcamentoParaEditar}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={confirmarDelete}
        title="Deletar Orçamento"
        message="Tem certeza que deseja deletar este orçamento? Esta ação não pode ser desfeita."
      />
    </div>
  );
}