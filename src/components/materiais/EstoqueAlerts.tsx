import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertBadge } from '../shared/AlertBadge';
import { checkEstoqueAlert } from '../../utils/alertUtils';

export function EstoqueAlerts() {
  const { materiais, estoque } = useApp();

  const alertas = estoque
    .map(item => {
      const material = materiais.find(m => m.id === item.materialId);
      if (!material) return null;

      const alert = checkEstoqueAlert(material, item.quantidade);
      if (alert.type === 'success') return null;

      return {
        id: item.id,
        material: material.nome,
        ...alert
      };
    })
    .filter(Boolean);

  if (alertas.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Alertas de Estoque</h3>
      <div className="space-y-2">
        {alertas.map(alerta => (
          <div key={alerta.id} className="flex justify-between items-center">
            <span className="text-gray-700">{alerta.material}</span>
            <AlertBadge 
              type={alerta.type} 
              message={alerta.message} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}