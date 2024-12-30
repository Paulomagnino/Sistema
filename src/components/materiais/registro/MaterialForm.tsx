import React, { useState } from 'react';
import { Modal } from '../../shared/Modal';
import { FormField } from '../../shared/FormField';
import { useForm } from '../../../hooks/useForm';
import { useApp } from '../../../context/AppContext';
import { Material } from '../../../types/material';

interface MaterialFormProps {
  isOpen: boolean;
  onClose: () => void;
  materialParaEditar?: Material | null;
}

const materialInicial: Material = {
  id: '',
  codigo: '',
  nome: '',
  descricao: '',
  unidade: '',
  minimo: 0,
  categoria: 'material',
  fornecedor: '',
  projeto: 'todos',
  ultimaAtualizacao: new Date().toISOString()
};

export function MaterialForm({ isOpen, onClose, materialParaEditar }: MaterialFormProps) {
  const { materiais, setMateriais, projetos } = useApp();
  const { values, handleChange, reset } = useForm<Material>(
    materialParaEditar || materialInicial
  );
  const [error, setError] = useState<string | null>(null);

  const gerarCodigoUnico = () => {
    let numero = 1;
    let codigo;
    do {
      codigo = `MAT${String(numero).padStart(4, '0')}`;
      numero++;
    } while (materiais.some(m => m.codigo === codigo));
    return codigo;
  };

  const validarCodigo = (codigo: string, materialId?: string) => {
    return !materiais.some(m => 
      m.codigo === codigo && m.id !== materialId // Ignora o próprio material ao editar
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const codigo = values.codigo || gerarCodigoUnico();

    // Valida se o código já existe
    if (!validarCodigo(codigo, materialParaEditar?.id)) {
      setError('Este código já está em uso. Por favor, escolha outro código.');
      return;
    }
    
    const novoMaterial = {
      ...values,
      id: materialParaEditar ? values.id : crypto.randomUUID(),
      codigo,
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
        <div>
          <FormField
            label="Código"
            name="codigo"
            value={values.codigo}
            onChange={handleChange}
            placeholder="Ex: MAT0001 (deixe em branco para gerar automaticamente)"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <FormField
          label="Nome"
          name="nome"
          value={values.nome}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={values.descricao || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <FormField
          label="Unidade"
          name="unidade"
          value={values.unidade}
          onChange={handleChange}
          required
          placeholder="Ex: kg, m², unidade"
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
            Categoria
          </label>
          <select
            name="categoria"
            value={values.categoria}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="material">Material</option>
            <option value="ferramenta">Ferramenta</option>
            <option value="equipamento">Equipamento</option>
            <option value="epi">EPI</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <FormField
          label="Fornecedor"
          name="fornecedor"
          value={values.fornecedor || ''}
          onChange={handleChange}
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
          >
            <option value="todos">Todos os Projetos</option>
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