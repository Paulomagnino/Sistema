import React from 'react';

interface EtapaProgressBarProps {
  progresso: number;
  className?: string;
}

export function EtapaProgressBar({ progresso, className = '' }: EtapaProgressBarProps) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progresso}%` }}
      />
      <div className="text-xs text-gray-600 mt-1">
        {progresso}% concluído
      </div>
    </div>
  );
}