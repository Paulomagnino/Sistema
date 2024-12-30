import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAgo } from '../../utils/dateUtils';

interface Activity {
  id: string;
  description: string;
  timestamp: number;
  author: string;
  type: 'task' | 'material' | 'transaction';
  projeto?: string;
  status?: string;
}

export function RecentActivities() {
  const { tarefas } = useApp();

  // Filtra apenas tarefas pendentes e ordena por data de criação
  const tarefasPendentes = tarefas
    .filter(t => t.status === 'pendente')
    .sort((a, b) => {
      // Assume que a tarefa mais recente está no início do array
      return tarefas.indexOf(a) - tarefas.indexOf(b);
    })
    .slice(0, 5); // Mostra apenas as 5 mais recentes

  const allActivities: Activity[] = tarefasPendentes.map(t => ({
    id: `task-${t.id}`,
    description: `Nova tarefa "${t.titulo}" adicionada ao projeto ${t.projeto}`,
    timestamp: new Date().getTime(),
    author: t.responsavel,
    type: 'task',
    projeto: t.projeto,
    status: t.status
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Tarefas Pendentes Recentes</h2>
      <div className="space-y-4">
        {allActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-800">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm font-medium text-blue-600">
                      Responsável: {activity.author}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Pendente
                </span>
              </div>
            </div>
          </div>
        ))}

        {allActivities.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Nenhuma tarefa pendente recente.
          </p>
        )}
      </div>
    </div>
  );
}