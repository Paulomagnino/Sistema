import React from 'react';
import { TransacaoTipo } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ValorFormatadoProps {
  valor: number;
  tipo?: TransacaoTipo;
  className?: string;
}

export function ValorFormatado({ valor, tipo, className = '' }: ValorFormatadoProps) {
  const getColorClass = () => {
    if (!tipo) return '';
    return tipo === 'receita' ? 'text-green-600' : 'text-red-600';
  };

  const prefixo = tipo ? (tipo === 'receita' ? '+' : '-') : '';
  
  return (
    <span className={`font-semibold ${getColorClass()} ${className}`}>
      {prefixo}{formatCurrency(valor)}
    </span>
  );
}