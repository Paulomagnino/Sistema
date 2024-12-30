import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { Orcamento } from '../../types';
import { ValorFormatado } from '../shared/ValorFormatado';
import { StatusBadge } from '../shared/StatusBadge';
import { formatDate } from '../../utils/formatters';

interface OrcamentoCardProps {
  orcamento: Orcamento;
  projeto: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function OrcamentoCard({ orcamento, projeto, onEdit, onDelete }: OrcamentoCardProps) {
  // Use the servico field as the main title
  const titulo = orcamento.servico || 'Serviço não especificado';

  // Determine if it's revenue or expense based on service items
  const isReceita = orcamento.itens.some(item => item.categoria === 'servico');
  const bgColorClass = isReceita ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className={`rounded-lg border ${bgColorClass}`}>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{titulo}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <StatusBadge status={orcamento.status} />
          {orcamento.pago && (
            <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Pago
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-3">
          <p>Projeto: {projeto}</p>
          <p>Data: {formatDate(orcamento.data)}</p>
          {orcamento.pago && orcamento.dataPagamento && (
            <p>Pago em: {formatDate(orcamento.dataPagamento)}</p>
          )}
        </div>

        <div className="mb-3">
          <ValorFormatado 
            valor={orcamento.valor} 
            tipo={isReceita ? 'receita' : 'despesa'} 
            className="text-lg" 
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}