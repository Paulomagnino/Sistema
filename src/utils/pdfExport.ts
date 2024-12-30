import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export function exportarRelatorioPDF(tipo: string, dados: any, filtros: any) {
  const pdf = new jsPDF();
  const dataAtual = new Date().toLocaleDateString();
  
  // Configuração do cabeçalho
  pdf.setFontSize(20);
  pdf.text('SIGO Construction', 105, 15, { align: 'center' });
  pdf.setFontSize(16);
  pdf.text(`Relatório ${tipo}`, 105, 25, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text(`Gerado em: ${dataAtual}`, 105, 32, { align: 'center' });

  // Adiciona filtros aplicados
  pdf.setFontSize(12);
  let yPos = 45;
  if (filtros.dataInicio || filtros.dataFim) {
    pdf.text(`Período: ${filtros.dataInicio ? formatDate(filtros.dataInicio) : ''} até ${filtros.dataFim ? formatDate(filtros.dataFim) : ''}`, 14, yPos);
    yPos += 7;
  }
  if (filtros.projeto) {
    pdf.text(`Projeto: ${filtros.projeto}`, 14, yPos);
    yPos += 7;
  }
  if (filtros.categoria) {
    pdf.text(`Categoria: ${filtros.categoria}`, 14, yPos);
    yPos += 7;
  }

  yPos += 10;

  switch (tipo) {
    case 'Financeiro':
      exportarRelatorioFinanceiro(pdf, dados, yPos);
      break;
    case 'Estoque':
      exportarRelatorioEstoque(pdf, dados, yPos);
      break;
    case 'Movimentações':
      exportarRelatorioMovimentacoes(pdf, dados, yPos);
      break;
    case 'Consumo':
      exportarRelatorioConsumo(pdf, dados, yPos);
      break;
  }

  // Adiciona numeração de páginas
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(`Página ${i} de ${pageCount}`, pdf.internal.pageSize.width - 20, pdf.internal.pageSize.height - 10);
  }

  pdf.save(`relatorio_${tipo.toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`);
}

function exportarRelatorioFinanceiro(pdf: jsPDF, dados: any, yPos: number) {
  // Resumo financeiro
  pdf.setFontSize(14);
  pdf.text('Resumo Financeiro', 14, yPos);
  
  const resumoData = [
    ['Total de Receitas', formatCurrency(dados.totalReceitas)],
    ['Total de Despesas', formatCurrency(dados.totalDespesas)],
    ['Saldo', formatCurrency(dados.saldo)]
  ];

  autoTable(pdf, {
    startY: yPos + 5,
    head: [['Descrição', 'Valor']],
    body: resumoData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });

  // Transações
  const transacoesData = dados.transacoes.map((t: any) => [
    formatDate(t.data),
    t.tipo === 'receita' ? 'Receita' : 'Despesa',
    t.descricao,
    t.categoria,
    formatCurrency(t.valor)
  ]);

  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 15,
    head: [['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor']],
    body: transacoesData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });
}

function exportarRelatorioEstoque(pdf: jsPDF, dados: any, yPos: number) {
  pdf.setFontSize(14);
  pdf.text('Posição de Estoque', 14, yPos);

  const estoqueData = dados.itens.map((item: any) => [
    item.codigo,
    item.nome,
    item.quantidade.toString(),
    item.unidade,
    item.minimo.toString(),
    item.quantidade <= item.minimo ? 'Estoque Baixo' : 'Normal'
  ]);

  autoTable(pdf, {
    startY: yPos + 5,
    head: [['Código', 'Material', 'Quantidade', 'Unidade', 'Mínimo', 'Status']],
    body: estoqueData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });
}

function exportarRelatorioMovimentacoes(pdf: jsPDF, dados: any, yPos: number) {
  pdf.setFontSize(14);
  pdf.text('Movimentações de Estoque', 14, yPos);

  const movimentacoesData = dados.movimentacoes.map((mov: any) => [
    formatDate(mov.data),
    mov.material,
    mov.tipo === 'entrada' ? 'Entrada' : 'Saída',
    mov.quantidade.toString(),
    mov.projeto,
    mov.responsavel
  ]);

  autoTable(pdf, {
    startY: yPos + 5,
    head: [['Data', 'Material', 'Tipo', 'Quantidade', 'Projeto', 'Responsável']],
    body: movimentacoesData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });
}

function exportarRelatorioConsumo(pdf: jsPDF, dados: any, yPos: number) {
  pdf.setFontSize(14);
  pdf.text('Análise de Consumo', 14, yPos);

  // Top 5 materiais mais consumidos
  const consumoData = dados.topMateriais.map((item: any) => [
    item.material,
    item.quantidade.toString(),
    item.percentual.toFixed(2) + '%'
  ]);

  autoTable(pdf, {
    startY: yPos + 5,
    head: [['Material', 'Quantidade', '% do Total']],
    body: consumoData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });

  // Consumo por projeto
  const projetoData = dados.consumoPorProjeto.map((item: any) => [
    item.projeto,
    item.quantidade.toString(),
    item.percentual.toFixed(2) + '%'
  ]);

  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 15,
    head: [['Projeto', 'Quantidade', '% do Total']],
    body: projetoData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });
}