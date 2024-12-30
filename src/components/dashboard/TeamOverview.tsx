import React from 'react';
import { useApp } from '../../context/AppContext';

export function TeamOverview() {
  const { membros } = useApp();

  const membrosDestaque = membros
    .map(membro => ({
      ...membro,
      numProjetos: membro.projetos.length
    }))
    .sort((a, b) => b.numProjetos - a.numProjetos)
    .slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Equipe em Destaque</h2>
      <div className="space-y-4">
        {membrosDestaque.map((membro) => (
          <div key={membro.id} className="flex items-center space-x-4">
            <img
              src={membro.foto}
              alt={membro.nome}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-800">{membro.nome}</p>
              <p className="text-sm text-gray-600">
                {membro.cargo} • {membro.numProjetos} projetos
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}