import React from 'react';
import { Plus, Calendar, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import { EtapaForm } from './EtapaForm';
import { StatusBadge } from '../shared/StatusBadge';
import { formatDate } from '../../utils/formatters';

export function CronogramaPage() {
  const { etapas, setEtapas, projetos } = useApp();
  const { isOpen, open, close } = useModal();
  const [etapaParaEditar, setEtapaParaEditar] = React.useState(null);

  const handleNovaEtapa = () => {
    setEtapaParaEditar(null);
    open();
  };

  const handleEditarEtapa = (etapa) => {
    setEtapaParaEditar(etapa);
    open();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Cronograma</h1>
        <button
          onClick={handleNovaEtapa}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nova Etapa
        </button>
      </div>

      <div className="grid gap-6">
        {projetos.map(projeto => (
          <div key={projeto.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-800">{projeto.nome}</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {etapas
                  .filter(etapa => etapa.projetoId === projeto.id)
                  .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())
                  .map(etapa => (
                    <div
                      key={etapa.id}
                      className="relative pl-8 pb-6 border-l-2 border-blue-200 last:pb-0"
                      onClick={() => handleEditarEtapa(etapa)}
                    >
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500" />
                      
                      <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{etapa.titulo}</h3>
                            <p className="text-sm text-gray-600 mt-1">{etapa.descricao}</p>
                          </div>
                          <StatusBadge status={etapa.status} />
                        </div>
                        
                        <div className="mt-4 flex gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(etapa.dataInicio)} - {formatDate(etapa.dataFim)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{etapa.responsavel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <EtapaForm
        isOpen={isOpen}
        onClose={() => {
          close();
          setEtapaParaEditar(null);
        }}
        etapaParaEditar={etapaParaEditar}
      />
    </div>
  );
}