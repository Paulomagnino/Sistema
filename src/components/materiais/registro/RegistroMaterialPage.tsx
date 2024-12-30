import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useModal } from '../../../hooks/useModal';
import { MaterialForm } from './MaterialForm';
import { MaterialList } from './MaterialList';

export function RegistroMaterialPage() {
  const { isOpen, open, close } = useModal();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Registro de Materiais</h1>
        <button
          onClick={open}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Novo Material
        </button>
      </div>

      <MaterialList />
      
      <MaterialForm 
        isOpen={isOpen}
        onClose={close}
      />
    </div>
  );
}