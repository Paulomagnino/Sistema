import React from 'react';

interface MenuItemProps {
  icone: React.ReactNode;
  texto: string;
  ativo: boolean;
  onClick: () => void;
}

export function MenuItem({ icone, texto, ativo, onClick }: MenuItemProps) {
  return (
    <button
      className={`
        flex items-center space-x-3 w-full p-3 rounded-lg
        transition-colors duration-200
        ${ativo 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 hover:bg-gray-100'}
      `}
      onClick={onClick}
    >
      {icone}
      <span>{texto}</span>
    </button>
  );
}