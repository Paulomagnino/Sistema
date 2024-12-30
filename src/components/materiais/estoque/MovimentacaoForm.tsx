import React from 'react';
import { Modal } from '../../shared/Modal';
import { FormField } from '../../shared/FormField';
import { useForm } from '../../../hooks/useForm';
import { useApp } from '../../../context/AppContext';
import { MovimentacaoEstoque } from '../../../types/material';

interface MovimentacaoFormProps {
  isOpen: boolean;
  onClose: () => void;
  movimentacaoParaEditar?: MovimentacaoEstoque | null;
}

const movimentacaoInicial: MovimentacaoEstoque = {
  id: '',
  materialId: '',
  tipo: 'entrada',
  quantidade: 0,
  data: new Date().toISOString().split('T')[0],
  projeto: '',
  responsavel: '',
  notaFiscal: '',
  observacao: ''
};

export function MovimentacaoForm({ isOpen, onClose, movimentacaoParaEditar }: MovimentacaoFormProps) {
  const { 
    materiais, 
    setMateriais,
    projetos, 
    membros, 
    movimentacoes, 
    setMovimentacoes, 
    estoque, 
    setEstoque 
  } = useApp();
  
  const { values, handleChange, reset } = useForm<MovimentacaoEstoque>(
    movimentacaoParaEditar || movimentacaoInicial
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaMovimentacao = {
      ...values,
      id: movimentacaoParaEditar ? values.id : crypto.randomUUID()
    };

    // Adiciona a movimentação
    if (movimentacaoParaEditar) {
      setMovimentacoes(movimentacoes.map(m => m.id === novaMovimentacao.id ? novaMovimentacao : m));
    } else {
      setMovimentacoes([...movimentacoes, novaMovimentacao]);
    }

    // Atualiza o estoque
    const estoqueAtual = estoque.find(e => e.materialId === values.materialId);
    const quantidade = values.tipo === 'entrada' ? values.quantidade : -values.quantidade;

    if (estoqueAtual) {
      setEstoque(estoque.map(e => 
        e.materialId === values.materialId 
          ? { ...e, quantidade: e.quantidade + quantidade, ultimaAtualizacao: new Date().toISOString() }
          : e
      ));
    } else {
      setEstoque([...estoque, {
        id: crypto.randomUUID(),
        materialId: values.materialId,
        quantidade: quantidade,
        ultimaAtualizacao: new Date().toISOString()
      }]);
    }

    // Atualiza o material
    setMateriais(materiais.map(material => {
      if (material.id === values.materialId) {
        const novaQuantidade = estoqueAtual 
          ? estoqueAtual.quantidade + quantidade 
          : quantidade;
          
        return {
          ...material,
          quantidade: novaQuantidade,
          ultimaAtualizacao: new Date().toISOString()
        };
      }
      return material;
    }));

    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={movimentacaoParaEditar ? 'Editar Movimentação' : 'Nova Movimentação'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Material</label>
          <select
            name="materialId"
            value={values.materialId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um material</option>
            {materiais.map(material => (
              <option key={material.id} value={material.id}>
                {material.codigo} - {material.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            name="tipo"
            value={values.tipo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>

        <FormField
          label="Quantidade"
          name="quantidade"
          type="number"
          value={values.quantidade}
          onChange={handleChange}
          required
          min="0"
        />

        <FormField
          label="Data"
          name="data"
          type="date"
          value={values.data}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Projeto</label>
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
          <label className="block text-sm font-medium text-gray-700">Responsável</label>
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
          label="Nota Fiscal"
          name="notaFiscal"
          value={values.notaFiscal || ''}
          onChange={handleChange}
          placeholder="Número da NF (opcional)"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Observação</label>
          <textarea
            name="observacao"
            value={values.observacao || ''}
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
            {movimentacaoParaEditar ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}