import React from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { FormField } from '../shared/FormField';
import { useOrcamentoForm } from '../../hooks/useOrcamentoForm';
import { OrcamentoItemForm } from './OrcamentoItemForm';
import { ValorFormatado } from '../shared/ValorFormatado';
import { Orcamento } from '../../types';

interface OrcamentoFormProps {
  isOpen: boolean;
  onClose: () => void;
  projetoId: string;
  orcamentoParaEditar?: Orcamento | null;
}

export function OrcamentoForm({ 
  isOpen, 
  onClose, 
  projetoId, 
  orcamentoParaEditar 
}: OrcamentoFormProps) {
  const {
    formData,
    itens,
    handleChange,
    adicionarItem,
    removerItem,
    atualizarItem,
    calcularTotal,
    salvarOrcamento
  } = useOrcamentoForm(projetoId, orcamentoParaEditar, isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    salvarOrcamento();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={orcamentoParaEditar ? 'Editar Orçamento' : 'Novo Orçamento'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormField
            label="Serviço"
            name="servico"
            value={formData.servico}
            onChange={handleChange}
            required
            placeholder="Ex: Limpeza da área de lazer"
          />

          <FormField
            label="Data"
            name="data"
            type="date"
            value={formData.data}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="pago"
              name="pago"
              checked={formData.pago}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="pago" className="text-sm font-medium text-gray-700">
              Pago
            </label>
          </div>

          {formData.pago && (
            <FormField
              label="Data do Pagamento"
              name="dataPagamento"
              type="date"
              value={formData.dataPagamento || ''}
              onChange={handleChange}
              required
            />
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Itens do Orçamento</h3>
            <button
              type="button"
              onClick={adicionarItem}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              Adicionar Item
            </button>
          </div>

          <div className="space-y-4">
            {itens.map(item => (
              <OrcamentoItemForm
                key={item.id}
                item={item}
                onUpdate={atualizarItem}
                onRemove={removerItem}
              />
            ))}

            {itens.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Nenhum item adicionado
              </p>
            )}
          </div>

          <div className="mt-4 text-right">
            <p className="text-sm text-gray-600">Total:</p>
            <ValorFormatado valor={calcularTotal()} className="text-lg" />
          </div>
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
            {orcamentoParaEditar ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}