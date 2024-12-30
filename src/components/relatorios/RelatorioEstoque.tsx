import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RelatorioEstoqueProps {
  filtros: {
    dataInicio: string;
    dataFim: string;
    projeto: string;
    categoria: string;
  };
}

export function RelatorioEstoque({ filtros }: RelatorioEstoqueProps) {
  const { materiais, estoque } = useApp();

  const estoqueComDetalhes = estoque.map(item => {
    const material = materiais.find(m => m.id === item.materialId);
    return {
      ...item,
      material
    };
  }).filter(item => {
    if (!item.material) return false;
    if (filtros.projeto && item.material.projeto !== filtros.projeto) return false;
    if (filtros.categoria && item.material.categoria !== filtros.categoria) return false;
    return true;
  });

  const dadosGrafico = estoqueComDetalhes.map(item => ({
    nome: item.material?.nome || '',
    quantidade: item.quantidade,
    minimo: item.material?.minimo || 0
  }));

  return (
    <div className="space-y-6">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantidade" fill="#3B82F6" name="Quantidade Atual" />
            <Bar dataKey="minimo" fill="#EF4444" name="Quantidade Mínima" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total de Itens</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {estoqueComDetalhes.length}
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Itens Abaixo do Mínimo</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {estoqueComDetalhes.filter(item => 
              item.quantidade <= (item.material?.minimo || 0)
            ).length}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Itens em Dia</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {estoqueComDetalhes.filter(item => 
              item.quantidade > (item.material?.minimo || 0)
            ).length}
          </p>
        </div>
      </div>
    </div>
  );
}