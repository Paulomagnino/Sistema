import React from 'react';
import { TrendingUp, Users, Package, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function MetricCards() {
  const { projetos, membros, materiais, tarefas } = useApp();

  const projetosAtivos = projetos.filter(p => p.status === 'em_andamento').length;
  const totalMembros = membros.length;
  const totalMateriais = materiais.reduce((acc, m) => acc + m.quantidade, 0);
  const alertasPendentes = materiais.filter(m => m.quantidade <= m.minimo).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Projetos Ativos"
        value={projetosAtivos.toString()}
        icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
        trend={`${projetosAtivos} em andamento`}
      />
      <MetricCard
        title="Membros da Equipe"
        value={totalMembros.toString()}
        icon={<Users className="h-6 w-6 text-green-600" />}
        trend="Equipe atual"
      />
      <MetricCard
        title="Materiais em Estoque"
        value={totalMateriais.toString()}
        icon={<Package className="h-6 w-6 text-purple-600" />}
        trend={`${alertasPendentes} itens em alerta`}
      />
      <MetricCard
        title="Tarefas Pendentes"
        value={tarefas.filter(t => t.status === 'pendente').length.toString()}
        icon={<AlertTriangle className="h-6 w-6 text-yellow-600" />}
        trend="Necessitam atenção"
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

function MetricCard({ title, value, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        {icon}
        <span className="text-2xl font-bold text-gray-800">{value}</span>
      </div>
      <h3 className="mt-4 text-gray-600 font-medium">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{trend}</p>
    </div>
  );
}