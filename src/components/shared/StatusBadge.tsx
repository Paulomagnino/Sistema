import React from 'react';

interface StatusBadgeProps {
  status: 'pendente' | 'em_andamento' | 'concluido' | 'atrasado' | 'em_progresso' | 'em_revisao' | 'aprovado' | 'rejeitado';
  className?: string;
}

const statusConfig = {
  pendente: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pendente'
  },
  em_andamento: {
    color: 'bg-blue-100 text-blue-800',
    label: 'Em Andamento'
  },
  em_progresso: {
    color: 'bg-blue-100 text-blue-800',
    label: 'Em Progresso'
  },
  concluido: {
    color: 'bg-green-100 text-green-800',
    label: 'Concluído'
  },
  atrasado: {
    color: 'bg-red-100 text-red-800',
    label: 'Atrasado'
  },
  em_revisao: {
    color: 'bg-purple-100 text-purple-800',
    label: 'Em Revisão'
  },
  aprovado: {
    color: 'bg-green-100 text-green-800',
    label: 'Aprovado'
  },
  rejeitado: {
    color: 'bg-red-100 text-red-800',
    label: 'Rejeitado'
  }
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} ${className}`}>
      {config.label}
    </span>
  );
}