import React from 'react';
import { Plus } from 'lucide-react';
import { useModal } from '../../../hooks/useModal';
import { MovimentacaoForm } from './MovimentacaoForm';
import { EstoqueList } from './EstoqueList';
import { MovimentacoesList } from './MovimentacoesList';

export function EstoquePage() {
  const { isOpen, open, close } = useModal();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Controle de Estoque</h1>
        <button
          onClick={open}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nova Movimentação
        </button>
      </div>

      <EstoqueList />
      <MovimentacoesList />
      
      <MovimentacaoForm 
        isOpen={isOpen}
        onClose={close}
      />
    </div>
  );
}