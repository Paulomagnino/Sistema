import React, { useState } from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import { RelatorioEstoque } from './RelatorioEstoque';
import { RelatorioMovimentacoes } from './RelatorioMovimentacoes';
import { RelatorioConsumo } from './RelatorioConsumo';
import { RelatorioFinanceiro } from './RelatorioFinanceiro';
import { exportarRelatorioPDF } from '../../utils/pdfExport';
import { useApp } from '../../context/AppContext';

export function RelatoriosPage() {
  const { transacoes, materiais, movimentacoes, projetos } = useApp();
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    projeto: '',
    categoria: ''
  });

  const [tipoRelatorio, setTipoRelatorio] = useState('financeiro');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleExportar = () => {
    let dados;
    
    switch (tipoRelatorio) {
      case 'financeiro':
        const transacoesFiltradas = transacoes.filter(t => {
          if (filtros.dataInicio && t.data < filtros.dataInicio) return false;
          if (filtros.dataFim && t.data > filtros.dataFim) return false;
          if (filtros.projeto && t.projeto !== filtros.projeto) return false;
          if (filtros.categoria && t.categoria !== filtros.categoria) return false;
          return true;
        });

        const totalReceitas = transacoesFiltradas
          .filter(t => t.tipo === 'receita')
          .reduce((acc, t) => acc + t.valor, 0);

        const totalDespesas = transacoesFiltradas
          .filter(t => t.tipo === 'despesa')
          .reduce((acc, t) => acc + t.valor, 0);

        dados = {
          totalReceitas,
          totalDespesas,
          saldo: totalReceitas - totalDespesas,
          transacoes: transacoesFiltradas
        };
        break;

      case 'estoque':
        dados = {
          itens: materiais.map(m => ({
            codigo: m.codigo,
            nome: m.nome,
            quantidade: m.quantidade,
            unidade: m.unidade,
            minimo: m.minimo
          }))
        };
        break;

      case 'movimentacoes':
        dados = {
          movimentacoes: movimentacoes.map(mov => ({
            data: mov.data,
            material: materiais.find(m => m.id === mov.materialId)?.nome || '',
            tipo: mov.tipo,
            quantidade: mov.quantidade,
            projeto: mov.projeto,
            responsavel: mov.responsavel
          }))
        };
        break;

      case 'consumo':
        const consumos = movimentacoes.filter(mov => mov.tipo === 'saida');
        const totalConsumo = consumos.reduce((acc, mov) => acc + mov.quantidade, 0);

        const consumoPorMaterial = consumos.reduce((acc, mov) => {
          const material = materiais.find(m => m.id === mov.materialId)?.nome || '';
          acc[material] = (acc[material] || 0) + mov.quantidade;
          return acc;
        }, {} as Record<string, number>);

        const consumoPorProjeto = consumos.reduce((acc, mov) => {
          acc[mov.projeto] = (acc[mov.projeto] || 0) + mov.quantidade;
          return acc;
        }, {} as Record<string, number>);

        dados = {
          topMateriais: Object.entries(consumoPorMaterial)
            .map(([material, quantidade]) => ({
              material,
              quantidade,
              percentual: (quantidade / totalConsumo) * 100
            }))
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 5),
          consumoPorProjeto: Object.entries(consumoPorProjeto)
            .map(([projeto, quantidade]) => ({
              projeto,
              quantidade,
              percentual: (quantidade / totalConsumo) * 100
            }))
        };
        break;
    }

    exportarRelatorioPDF(
      tipoRelatorio.charAt(0).toUpperCase() + tipoRelatorio.slice(1),
      dados,
      filtros
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <Filter className="h-5 w-5" />
            Filtros
          </button>
          <button
            onClick={handleExportar}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Download className="h-5 w-5" />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => setTipoRelatorio('financeiro')}
              className={`p-4 rounded-lg border text-left transition-colors ${
                tipoRelatorio === 'financeiro' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <FileText className="h-6 w-6 mb-2" />
              <h3 className="font-medium">Financeiro</h3>
              <p className="text-sm text-gray-500">Receitas, despesas e fluxo de caixa</p>
            </button>

            <button
              onClick={() => setTipoRelatorio('estoque')}
              className={`p-4 rounded-lg border text-left transition-colors ${
                tipoRelatorio === 'estoque' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <FileText className="h-6 w-6 mb-2" />
              <h3 className="font-medium">Estoque</h3>
              <p className="text-sm text-gray-500">Posição atual do estoque</p>
            </button>

            <button
              onClick={() => setTipoRelatorio('movimentacoes')}
              className={`p-4 rounded-lg border text-left transition-colors ${
                tipoRelatorio === 'movimentacoes' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <FileText className="h-6 w-6 mb-2" />
              <h3 className="font-medium">Movimentações</h3>
              <p className="text-sm text-gray-500">Entradas e saídas de materiais</p>
            </button>

            <button
              onClick={() => setTipoRelatorio('consumo')}
              className={`p-4 rounded-lg border text-left transition-colors ${
                tipoRelatorio === 'consumo' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <FileText className="h-6 w-6 mb-2" />
              <h3 className="font-medium">Consumo</h3>
              <p className="text-sm text-gray-500">Análise de consumo de materiais</p>
            </button>
          </div>

          {mostrarFiltros && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={e => setFiltros({ ...filtros, dataInicio: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  value={filtros.dataFim}
                  onChange={e => setFiltros({ ...filtros, dataFim: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projeto
                </label>
                <select
                  value={filtros.projeto}
                  onChange={e => setFiltros({ ...filtros, projeto: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="">Todos os projetos</option>
                  {projetos.map(projeto => (
                    <option key={projeto.id} value={projeto.nome}>
                      {projeto.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={filtros.categoria}
                  onChange={e => setFiltros({ ...filtros, categoria: e.target.value })}
                  className="w-full rounded-md border-gray-300"
                >
                  <option value="">Todas as categorias</option>
                  <option value="material">Material</option>
                  <option value="mao_de_obra">Mão de Obra</option>
                  <option value="equipamento">Equipamento</option>
                  <option value="servico">Serviço</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>
          )}

          <div className="mt-6">
            {tipoRelatorio === 'financeiro' && <RelatorioFinanceiro filtros={filtros} />}
            {tipoRelatorio === 'estoque' && <RelatorioEstoque filtros={filtros} />}
            {tipoRelatorio === 'movimentacoes' && <RelatorioMovimentacoes filtros={filtros} />}
            {tipoRelatorio === 'consumo' && <RelatorioConsumo filtros={filtros} />}
          </div>
        </div>
      </div>
    </div>
  );
}