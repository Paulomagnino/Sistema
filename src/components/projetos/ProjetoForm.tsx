import React, { useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { FormField } from '../shared/FormField';
import { useForm } from '../../hooks/useForm';
import { useApp } from '../../context/AppContext';
import { Projeto } from '../../types';

interface ProjetoFormProps {
  isOpen: boolean;
  onClose: () => void;
  projetoParaEditar?: Projeto | null;
}

const projetoInicial: Projeto = {
  id: '',
  nome: '',
  cliente: '',
  dataInicio: new Date().toISOString().split('T')[0],
  dataFim: '',
  orcamento: 0,
  status: 'em_andamento',
  descricao: ''
};

export function ProjetoForm({ isOpen, onClose, projetoParaEditar }: ProjetoFormProps) {
  const { projetos, setProjetos } = useApp();
  const { values, handleChange, reset, setValues } = useForm<Projeto>(
    projetoParaEditar || projetoInicial
  );

  // Update form when editing project changes
  useEffect(() => {
    if (projetoParaEditar) {
      setValues(projetoParaEditar);
    } else {
      reset();
    }
  }, [projetoParaEditar, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoProjeto = {
      ...values,
      id: projetoParaEditar ? projetoParaEditar.id : crypto.randomUUID()
    };

    if (projetoParaEditar) {
      setProjetos(projetos.map(p => p.id === novoProjeto.id ? novoProjeto : p));
    } else {
      setProjetos([...projetos, novoProjeto]);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projetoParaEditar ? 'Editar Projeto' : 'Novo Projeto'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Nome do Projeto"
          name="nome"
          value={values.nome}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Cliente"
          name="cliente"
          value={values.cliente}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Data de Início"
          name="dataInicio"
          type="date"
          value={values.dataInicio}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Data de Término"
          name="dataFim"
          type="date"
          value={values.dataFim}
          onChange={handleChange}
          required
        />
        
        <FormField
          label="Orçamento"
          name="orcamento"
          type="number"
          value={values.orcamento}
          onChange={handleChange}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={values.descricao}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
            {projetoParaEditar ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}