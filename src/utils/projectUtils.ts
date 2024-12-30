import { Projeto, Etapa } from '../types';

export function calculateProjectProgress(projeto: Projeto, etapas: Etapa[]): number {
  const etapasProjeto = etapas.filter(e => e.projetoId === projeto.id);
  
  if (etapasProjeto.length === 0) return 0;

  // Calcula o progresso ponderado das etapas
  const progressoTotal = etapasProjeto.reduce((acc, etapa) => {
    return acc + (etapa.progresso * etapa.peso);
  }, 0);

  // Calcula o peso total
  const pesoTotal = etapasProjeto.reduce((acc, etapa) => acc + etapa.peso, 0);

  // Retorna o progresso médio ponderado
  return Math.round(progressoTotal / pesoTotal);
}

export function calculateEtapaPeso(etapa: Etapa, todasEtapas: Etapa[]): number {
  const etapasProjeto = todasEtapas.filter(e => e.projetoId === etapa.projetoId);
  const pesoTotal = etapasProjeto.reduce((acc, e) => acc + e.peso, 0);
  return pesoTotal > 0 ? (etapa.peso / pesoTotal) * 100 : 0;
}