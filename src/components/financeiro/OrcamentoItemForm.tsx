import React from 'react';
import { Trash } from 'lucide-react';
import { OrcamentoItem } from '../../types';

interface OrcamentoItemFormProps {
  item: OrcamentoItem;
  onUpdate: (id: string, campo: keyof OrcamentoItem, valor: any) => void;
  onRemove: (id: string) => void;
}

export function OrcamentoItemForm({ item, onUpdate, onRemove }: OrcamentoItemFormProps) {
  return (
    <div className="flex gap-4 items-start border-b pb-4 mb-4 last:border-0">
      <div className="flex-1">
        <input
          type="text"
          value={item.descricao}
          onChange={(e) => onUpdate(item.id, 'descricao', e.target.value)}
          placeholder="Descrição do item"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div className="w-24">
        <input
          type="number"
          value={item.quantidade}
          onChange={(e) => onUpdate(item.id, 'quantidade', Number(e.target.value))}
          min="1"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div className="w-32">
        <input
          type="number"
          value={item.valorUnitario}
          onChange={(e) => onUpdate(item.id, 'valorUnitario', Number(e.target.value))}
          min="0"
          step="0.01"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div className="w-32">
        <select
          value={item.categoria}
          onChange={(e) => onUpdate(item.id, 'categoria', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="material">Material</option>
          <option value="mao_de_obra">Mão de Obra</option>
          <option value="equipamento">Equipamento</option>
          <option value="servico">Serviço</option>
          <option value="outros">Outros</option>
        </select>
      </div>
      
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="p-2 text-gray-400 hover:text-red-600"
      >
        <Trash className="h-5 w-5" />
      </button>
    </div>
  );
}