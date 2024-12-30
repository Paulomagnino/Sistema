import React from 'react';
import { useApp } from '../../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../utils/formatters';

interface RelatorioMovimentacoesProps {
  filtros: {
    dataInicio: string;
    dataFim: string;
    projeto: string;
    categoria: string;
  };
}

export function RelatorioMovimentacoes({ filtros }: RelatorioMovimentacoesProps) {
  const { movimentacoes, materiais } = useApp();

  const movimentacoesFiltradas = movimentacoes
    .filter(mov => {
      if (filtros.dataInicio && mov.data < filtros.dataInicio) return false;
      if (filtros.dataFim && mov.data > filtros.dataFim) return false;
      if (filtros.projeto && mov.projeto !== filtros.projeto) return false;
      
      if (filtros.categoria) {
        const material = materiais.find(m => m.id === mov.materialId);
        if (material?.categoria !== filtros.categoria) return false;
      }
      
      return true;
    })
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  const dadosGrafico = movimentacoesFiltradas.reduce((acc, mov) => {
    const data = mov.data;
    const existingData = acc.find(d => d.data === data);
    
    if (existingData) {
      if (mov.tipo === 'entrada') {
        existingData.entradas += mov.quantidade;
      } else {
        existingData.saidas += mov.quantidade;
      }
    } else {
      acc.push({
        data,
        entradas: mov.tipo === 'entrada' ? mov.quantidade : 0,
        saidas: mov.tipo === 'saida' ? mov.quantidade : 0
      });
    }
    
    return acc;
  }, [] as any[]);

  const totalEntradas = movimentacoesFiltradas
    .filter(mov => mov.tipo === 'entrada')
    .reduce((acc, mov) => acc + mov.quantidade, 0);

  const totalSaidas = movimentacoesFiltradas
    .filter(mov => mov.tipo === 'saida')
    .reduce((acc, mov) => acc + mov.quantidade, 0);

  return (
    <div className="space-y-6">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="data" 
              tickFormatter={(value) => formatDate(value)}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => formatDate(value)}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="entradas" 
              stroke="#22C55E" 
              name="Entradas"
            />
            <Line 
              type="monotone" 
              dataKey="saidas" 
              stroke="#EF4444" 
              name="Saídas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Total de Entradas</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {totalEntradas}
          </p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Total de Saídas</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {totalSaidas}
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total de Movimentações</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {movimentacoesFiltradas.length}
          </p>
        </div>
      </div>
    </div>
  );
}