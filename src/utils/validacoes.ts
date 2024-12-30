import { Transacao, Projeto, Etapa } from '../types';

export const validarTransacao = (transacao: Transacao): void => {
  if (transacao.valor <= 0) {
    throw new Error('O valor deve ser maior que zero');
  }
  
  if (!transacao.projeto) {
    throw new Error('O projeto é obrigatório');
  }
  
  if (!transacao.categoria) {
    throw new Error('A categoria é obrigatória');
  }
};

export const validarProjeto = (projeto: Projeto): void => {
  if (!projeto.nome.trim()) {
    throw new Error('O nome do projeto é obrigatório');
  }

  if (new Date(projeto.dataFim) < new Date(projeto.dataInicio)) {
    throw new Error('A data de término deve ser posterior à data de início');
  }

  if (projeto.orcamento <= 0) {
    throw new Error('O orçamento deve ser maior que zero');
  }
};

export const validarEtapa = (etapa: Etapa, etapas: Etapa[]): void => {
  if (!etapa.titulo.trim()) {
    throw new Error('O título da etapa é obrigatório');
  }

  if (new Date(etapa.dataFim) < new Date(etapa.dataInicio)) {
    throw new Error('A data de término deve ser posterior à data de início');
  }

  if (etapa.predecessorId) {
    const predecessor = etapas.find(e => e.id === etapa.predecessorId);
    if (!predecessor) {
      throw new Error('Etapa predecessora não encontrada');
    }
    if (new Date(etapa.dataInicio) < new Date(predecessor.dataFim)) {
      throw new Error('A data de início deve ser posterior à data de término da etapa predecessora');
    }
  }
};