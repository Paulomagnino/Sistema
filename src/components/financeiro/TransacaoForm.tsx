import React from 'react';
import { Modal } from '../shared/Modal';
import { FormField } from '../shared/FormField';
import { useForm } from '../../hooks/useForm';
import { useApp } from '../../context/AppContext';
import { Transacao } from '../../types';

interface TransacaoFormProps {
  isOpen: boolean;
  onClose: () => void;
  transacaoParaEditar?: Transacao | null;
}

const transacaoInicial: Transacao = {
  id: '',
  tipo: 'despesa',
  valor: 0,
  data: new Date().toISOString().split('T')[0],
  descricao: '',
  projeto: '',
  categoria: '',
  comprovante: ''
};

export function TransacaoForm({ isOpen, onClose, transacaoParaEditar }: TransacaoFormProps) {
  const { transacoes, setTransacoes, projetos } = useApp();
  const { values, handleChange, reset, setValues } = useForm<Transacao>(
    transacaoParaEditar || transacaoInicial
  );

  React.useEffect(() => {
    if (transacaoParaEditar) {
      setValues(transacaoParaEditar);
    } else {
      reset();
    }
  }, [transacaoParaEditar, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaTransacao = {
      ...values,
      id: transacaoParaEditar ? transacaoParaEditar.id : crypto.randomUUID()
    };

    if (transacaoParaEditar) {
      setTransacoes(transacoes.map(t => t.id === novaTransacao.id ? novaTransacao : t));
    } else {
      setTransacoes([...transacoes, novaTransacao]);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transacaoParaEditar ? 'Editar Transação' : 'Nova Transação'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            name="tipo"
            value={values.tipo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>

        <FormField
          label="Valor"
          name="valor"
          type="number"
          value={values.valor}
          onChange={handleChange}
          required
        />

        <FormField
          label="Data"
          name="data"
          type="date"
          value={values.data}
          onChange={handleChange}
          required
        />

        <FormField
          label="Descrição"
          name="descricao"
          value={values.descricao}
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categoria
          </label>
          <select
            name="categoria"
            value={values.categoria}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="material">Material</option>
            <option value="mao_de_obra">Mão de Obra</option>
            <option value="equipamento">Equipamento</option>
            <option value="servico">Serviço</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <FormField
          label="Comprovante (URL)"
          name="comprovante"
          value={values.comprovante}
          onChange={handleChange}
          placeholder="https://..."
        />

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
            {transacaoParaEditar ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}