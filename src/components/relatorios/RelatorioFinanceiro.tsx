import React from 'react';
import { useApp } from '../../context/AppContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface RelatorioFinanceiroProps {
  filtros: {
    dataInicio: string;
    dataFim: string;
    projeto: string;
    categoria: string;
  };
}

export function RelatorioFinanceiro({ filtros }: RelatorioFinanceiroProps) {
  const { transacoes, orcamentos } = useApp();

  // Filtra transações baseado nos filtros
  const transacoesFiltradas = transacoes.filter(transacao => {
    if (filtros.dataInicio && transacao.data < filtros.dataInicio) return false;
    if (filtros.dataFim && transacao.data > filtros.dataFim) return false;
    if (filtros.projeto && transacao.projeto !== filtros.projeto) return false;
    if (filtros.categoria && transacao.categoria !== filtros.categoria) return false;
    return true;
  });

  // Calcula totais
  const totalReceitas = transacoesFiltradas
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = transacoesFiltradas
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  // Agrupa transações por mês
  const transacoesPorMes = transacoesFiltradas.reduce((acc, transacao) => {
    const data = new Date(transacao.data);
    const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[mes]) {
      acc[mes] = { receitas: 0, despesas: 0 };
    }
    
    if (transacao.tipo === 'receita') {
      acc[mes].receitas += transacao.valor;
    } else {
      acc[mes].despesas += transacao.valor;
    }
    
    return acc;
  }, {} as Record<string, { receitas: number; despesas: number }>);

  const dadosGraficoFluxo = Object.entries(transacoesPorMes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, valores]) => ({
      mes,
      receitas: valores.receitas,
      despesas: valores.despesas,
      saldo: valores.receitas - valores.despesas
    }));

  // Agrupa despesas por categoria
  const despesasPorCategoria = transacoesFiltradas
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, transacao) => {
      acc[transacao.categoria] = (acc[transacao.categoria] || 0) + transacao.valor;
      return acc;
    }, {} as Record<string, number>);

  const dadosGraficoDespesas = Object.entries(despesasPorCategoria)
    .map(([categoria, valor]) => ({
      categoria,
      valor
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Total de Receitas</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {formatCurrency(totalReceitas)}
          </p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Total de Despesas</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {formatCurrency(totalDespesas)}
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${saldo >= 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
          <h3 className={`text-lg font-semibold ${saldo >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>
            Saldo
          </h3>
          <p className={`text-3xl font-bold mt-2 ${saldo >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
            {formatCurrency(saldo)}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosGraficoFluxo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                tickFormatter={(value) => {
                  const [ano, mes] = value.split('-');
                  return `${mes}/${ano}`;
                }}
              />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => {
                  const [ano, mes] = label.split('-');
                  return `${mes}/${ano}`;
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="receitas" 
                stroke="#22C55E" 
                name="Receitas"
              />
              <Line 
                type="monotone" 
                dataKey="despesas" 
                stroke="#EF4444" 
                name="Despesas"
              />
              <Line 
                type="monotone" 
                dataKey="saldo" 
                stroke="#3B82F6" 
                name="Saldo"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGraficoDespesas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="valor" fill="#EF4444" name="Valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Indicadores Financeiros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">Taxa de Execução Orçamentária</h4>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {orcamentos.length > 0
                ? `${((totalDespesas / orcamentos.reduce((acc, o) => acc + o.valor, 0)) * 100).toFixed(1)}%`
                : '0%'
              }
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">Média de Despesas por Transação</h4>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {transacoesFiltradas.filter(t => t.tipo === 'despesa').length > 0
                ? formatCurrency(totalDespesas / transacoesFiltradas.filter(t => t.tipo === 'despesa').length)
                : formatCurrency(0)
              }
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">Margem Operacional</h4>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {totalReceitas > 0
                ? `${((saldo / totalReceitas) * 100).toFixed(1)}%`
                : '0%'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}