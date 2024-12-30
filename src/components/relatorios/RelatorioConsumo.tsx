import React from 'react';
import { useApp } from '../../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RelatorioConsumoProps {
  filtros: {
    dataInicio: string;
    dataFim: string;
    projeto: string;
    categoria: string;
  };
}

export function RelatorioConsumo({ filtros }: RelatorioConsumoProps) {
  const { movimentacoes, materiais, projetos } = useApp();

  // Filtra movimentações de saída (consumo)
  const consumos = movimentacoes
    .filter(mov => {
      if (mov.tipo !== 'saida') return false;
      if (filtros.dataInicio && mov.data < filtros.dataInicio) return false;
      if (filtros.dataFim && mov.data > filtros.dataFim) return false;
      if (filtros.projeto && mov.projeto !== filtros.projeto) return false;
      
      if (filtros.categoria) {
        const material = materiais.find(m => m.id === mov.materialId);
        if (material?.categoria !== filtros.categoria) return false;
      }
      
      return true;
    });

  // Agrupa consumo por projeto
  const consumoPorProjeto = consumos.reduce((acc, mov) => {
    acc[mov.projeto] = (acc[mov.projeto] || 0) + mov.quantidade;
    return acc;
  }, {} as Record<string, number>);

  // Agrupa consumo por material
  const consumoPorMaterial = consumos.reduce((acc, mov) => {
    const material = materiais.find(m => m.id === mov.materialId);
    if (material) {
      acc[material.nome] = (acc[material.nome] || 0) + mov.quantidade;
    }
    return acc;
  }, {} as Record<string, number>);

  const COLORS = ['#3B82F6', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6'];

  const dadosGraficoProjeto = Object.entries(consumoPorProjeto).map(([name, value]) => ({
    name,
    value
  }));

  const dadosGraficoMaterial = Object.entries(consumoPorMaterial)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Consumo por Projeto</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosGraficoProjeto}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {dadosGraficoProjeto.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top 5 Materiais Mais Consumidos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosGraficoMaterial}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {dadosGraficoMaterial.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total de Projetos</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {Object.keys(consumoPorProjeto).length}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Total de Materiais</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {Object.keys(consumoPorMaterial).length}
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Total de Consumo</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {consumos.reduce((acc, mov) => acc + mov.quantidade, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}