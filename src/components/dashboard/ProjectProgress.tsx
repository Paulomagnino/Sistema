import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateProjectProgress } from '../../utils/projectUtils';

export function ProjectProgress() {
  const { projetos, etapas, tarefas } = useApp();

  const projetosAtivos = projetos
    .filter(p => p.status === 'em_andamento')
    .slice(0, 4);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Progresso dos Projetos</h2>
      <div className="space-y-4">
        {projetosAtivos.map((projeto) => {
          const progresso = calculateProjectProgress(projeto, etapas, tarefas);
          
          return (
            <div key={projeto.id}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{projeto.nome}</span>
                <span className="text-sm text-gray-600">
                  {progresso}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progresso}%` }}
                ></div>
              </div>
            </div>
          );
        })}

        {projetosAtivos.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Nenhum projeto em andamento.
          </p>
        )}
      </div>
    </div>
  );
}