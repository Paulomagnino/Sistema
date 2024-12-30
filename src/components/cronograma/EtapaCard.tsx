import React from 'react';
import { Calendar, Clock, BarChart2 } from 'lucide-react';
import { Etapa } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { EtapaProgressBar } from './EtapaProgressBar';

interface EtapaCardProps {
  etapa: Etapa;
  predecessor?: Etapa;
  onClick: () => void;
  pesoNoProjeto: number;
}

export function EtapaCard({ etapa, predecessor, onClick, pesoNoProjeto }: EtapaCardProps) {
  return (
    <div
      className="relative pl-8 pb-6 border-l-2 border-blue-200 last:pb-0"
      onClick={onClick}
    >
      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500" />
      
      <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">{etapa.titulo}</h3>
            <p className="text-sm text-gray-600 mt-1">{etapa.descricao}</p>
            {predecessor && (
              <p className="text-sm text-blue-600 mt-1">
                Predecessor: {predecessor.titulo} ({predecessor.status})
              </p>
            )}
          </div>
          <StatusBadge status={etapa.status} />
        </div>
        
        <div className="mt-4">
          <EtapaProgressBar progresso={etapa.progresso} />
          <div className="text-xs text-gray-500 mt-1">
            Peso no projeto: {(pesoNoProjeto * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(etapa.dataInicio)} - {formatDate(etapa.dataFim)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{etapa.responsavel}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Progresso: {etapa.progresso}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}