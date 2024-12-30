import React from 'react';
import { Modal } from '../shared/Modal';
import { FormField } from '../shared/FormField';
import { useForm } from '../../hooks/useForm';
import { useApp } from '../../context/AppContext';
import { Tarefa } from '../../types';

interface TarefaFormProps {
  isOpen: boolean;
  onClose: () => void;
  tarefaParaEditar?: Tarefa;
}

const tarefaInicial: Tarefa = {
  id: '',
  titulo: '',
  responsavel: '',
  projeto: '',
  status: 'pendente',
  prioridade: 'media'
};

export function TarefaForm({ isOpen, onClose, tarefaParaEditar }: TarefaFormProps) {
  const { tarefas, setTarefas, projetos, membros } = useApp();
  const { values, handleChange, reset } = useForm<Tarefa>(
    tarefaParaEditar || tarefaInicial
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaTarefa = {
      ...values,
      id: tarefaParaEditar ? values.id : crypto.randomUUID()
    };

    if (tarefaParaEditar) {
      setTarefas(tarefas.map(t => t.id === novaTarefa.id ? novaTarefa : t));
    } else {
      setTarefas([...tarefas, novaTarefa]);
    }

    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tarefaParaEditar ? 'Editar Tarefa' : 'Nova Tarefa'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Título"
          name="titulo"
          value={values.titulo}
          onChange={handleChange}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Responsável
          </label>
          <select
            name="responsavel"
            value={values.responsavel}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um responsável</option>
            {membros.map(membro => (
              <option key={membro.id} value={membro.nome}>
                {membro.nome}
              </option>
            ))}
          </select>
        </div>
        
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
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="pendente">Pendente</option>
            <option value="em_progresso">Em Progresso</option>
            <option value="em_revisao">Em Revisão</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prioridade
          </label>
          <select
            name="prioridade"
            value={values.prioridade}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
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
            {tarefaParaEditar ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}