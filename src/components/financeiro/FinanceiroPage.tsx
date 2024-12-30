import React from 'react';
import { Plus } from 'lucide-react';
import { useModal } from '../../hooks/useModal';
import { FinanceiroHeader } from './FinanceiroHeader';
import { TransacaoList } from './TransacaoList';
import { TransacaoForm } from './TransacaoForm';
import { RelatorioFinanceiro } from './RelatorioFinanceiro';
import { OrcamentoList } from './OrcamentoList';

export function FinanceiroPage() {
  const { isOpen, open, close } = useModal();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Financeiro</h1>
        <button
          onClick={open}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nova Transação
        </button>
      </div>

      <FinanceiroHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrcamentoList />
        <RelatorioFinanceiro />
      </div>

      <TransacaoList />
      
      <TransacaoForm 
        isOpen={isOpen}
        onClose={close}
      />
    </div>
  );
}