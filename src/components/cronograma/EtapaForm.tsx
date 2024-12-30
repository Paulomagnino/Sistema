import React, { useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { FormField } from '../shared/FormField';
import { useForm } from '../../hooks/useForm';
import { useApp } from '../../context/AppContext';
import { Etapa } from '../../types';

interface EtapaFormProps {
  isOpen: boolean;
  onClose: () => void;
  etapaParaEditar?: Etapa | null;
}

const etapaInicial: Etapa = {
  id: '',
  titulo: '',
  descricao: '',
  dataInicio: new Date().toISOString().split('T')[0],
  dataFim: '',
  status: 'pendente',
  responsavel: '',
  projetoId: '',
  predecessorId: '',
  progresso: 0,
  peso: 1 // Peso padrão definido como 1
};

export function EtapaForm({ isOpen, onClose, etapaParaEditar }: EtapaFormProps) {
  const { etapas, setEtapas, projetos, membros } = useApp();
  const { values, handleChange, reset, setValues } = useForm<Etapa>(
    etapaParaEditar || etapaInicial
  );

  useEffect(() => {
    if (isOpen) {
      if (etapaParaEditar) {
        setValues(etapaParaEditar);
      } else {
        setValues(etapaInicial);
      }
    }
  }, [isOpen, etapaParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaEtapa: Etapa = {
      ...values,
      id: etapaParaEditar?.id || crypto.randomUUID(),
      progresso: Number(values.progresso),
      peso: Number(values.peso) || 1 // Garante que o peso seja pelo menos 1
    };

    if (etapaParaEditar) {
      setEtapas(etapas.map(e => e.id === novaEtapa.id ? novaEtapa : e));
    } else {
      setEtapas([...etapas, novaEtapa]);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={etapaParaEditar ? 'Editar Etapa' : 'Nova Etapa'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Projeto
          </label>
          <select
            name="projetoId"
            value={values.projetoId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um projeto</option>
            {projetos.map(projeto => (
              <option key={projeto.id} value={projeto.id}>
                {projeto.nome}
              </option>
            ))}
          </select>
        </div>

        <FormField
          label="Título"
          name="titulo"
          value={values.titulo}
          onChange={handleChange}
          required
        />

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

        <FormField
          label="Progresso (%)"
          name="progresso"
          type="number"
          value={values.progresso}
          onChange={handleChange}
          required
          min="0"
          max="100"
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
            required
          >
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="atrasado">Atrasado</option>
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
            {etapaParaEditar ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}