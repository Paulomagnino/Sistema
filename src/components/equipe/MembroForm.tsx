import React from 'react';
import { Modal } from '../shared/Modal';
import { FormField } from '../shared/FormField';
import { useForm } from '../../hooks/useForm';
import { useApp } from '../../context/AppContext';
import { Membro } from '../../types';

interface MembroFormProps {
  isOpen: boolean;
  onClose: () => void;
  membroParaEditar?: Membro | null;
}

const membroInicial: Membro = {
  id: '',
  nome: '',
  cargo: '',
  email: '',
  telefone: '',
  projetos: [],
  foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150'
};

export function MembroForm({ isOpen, onClose, membroParaEditar }: MembroFormProps) {
  const { membros, setMembros, projetos } = useApp();
  const { values, handleChange, reset, setValues } = useForm<Membro>(
    membroParaEditar || membroInicial
  );

  React.useEffect(() => {
    if (membroParaEditar) {
      setValues(membroParaEditar);
    } else {
      reset();
    }
  }, [membroParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoMembro = {
      ...values,
      id: membroParaEditar ? membroParaEditar.id : crypto.randomUUID()
    };

    if (membroParaEditar) {
      setMembros(membros.map(m => m.id === novoMembro.id ? novoMembro : m));
    } else {
      setMembros([...membros, novoMembro]);
    }

    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={membroParaEditar ? 'Editar Membro' : 'Novo Membro'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Nome"
          name="nome"
          value={values.nome}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Cargo"
          name="cargo"
          value={values.cargo}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Telefone"
          name="telefone"
          value={values.telefone}
          onChange={handleChange}
          required
          placeholder="(11) 98765-4321"
        />
        
        <FormField
          label="URL da Foto"
          name="foto"
          value={values.foto}
          onChange={handleChange}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Projetos
          </label>
          <select
            multiple
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={values.projetos}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
              handleChange({
                target: {
                  name: 'projetos',
                  value: selectedOptions
                }
              } as any);
            }}
          >
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
            {membroParaEditar ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}