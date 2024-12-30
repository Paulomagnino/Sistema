import React from 'react';
import { Modal } from '../shared/Modal';
import { FormField } from '../shared/FormField';
import { useForm } from '../../hooks/useForm';
import { useApp } from '../../context/AppContext';
import { Material } from '../../types';

interface MaterialFormProps {
  isOpen: boolean;
  onClose: () => void;
  materialParaEditar?: Material | null;
}

const materialInicial: Material = {
  id: '',
  codigo: '', // Added product code
  nome: '',
  quantidade: 0,
  unidade: '',
  minimo: 0,
  projeto: '',
  ultimaAtualizacao: new Date().toISOString()
};

export function MaterialForm({ isOpen, onClose, materialParaEditar }: MaterialFormProps) {
  const { materiais, setMateriais, projetos } = useApp();
  const { values, handleChange, reset } = useForm<Material>(
    materialParaEditar || materialInicial
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoMaterial = {
      ...values,
      id: materialParaEditar ? values.id : crypto.randomUUID(),
      ultimaAtualizacao: new Date().toISOString()
    };

    if (materialParaEditar) {
      setMateriais(materiais.map(m => m.id === novoMaterial.id ? novoMaterial : m));
    } else {
      setMateriais([...materiais, novoMaterial]);
    }

    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={materialParaEditar ? 'Editar Material' : 'Novo Material'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Código do Material"
          name="codigo"
          value={values.codigo}
          onChange={handleChange}
          required
          placeholder="Ex: MAT001"
        />

        <FormField
          label="Nome do Material"
          name="nome"
          value={values.nome}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Quantidade"
          name="quantidade"
          type="number"
          value={values.quantidade}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Unidade"
          name="unidade"
          value={values.unidade}
          onChange={handleChange}
          required
          placeholder="ex: kg, m², unidade"
        />
        
        <FormField
          label="Quantidade Mínima"
          name="minimo"
          type="number"
          value={values.minimo}
          onChange={handleChange}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Projeto
          </label>
          <select
            name="projeto"
            value={values.projeto}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um projeto</option>
            {projetos.map(projeto => (
              <option key={projeto.id} value={projeto.nome}>
                {projeto.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {materialParaEditar ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}