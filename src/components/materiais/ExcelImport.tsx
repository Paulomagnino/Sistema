import React from 'react';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Material } from '../../types';

export function ExcelImport() {
  const { setMateriais } = useApp();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          
          const materials: Material[] = lines.slice(1).map(line => {
            const values = line.split(',');
            return {
              id: crypto.randomUUID(),
              nome: values[0],
              quantidade: Number(values[1]),
              unidade: values[2],
              minimo: Number(values[3]),
              projeto: values[4],
              ultimaAtualizacao: new Date().toISOString()
            };
          });

          setMateriais(prevMaterials => [...prevMaterials, ...materials]);
          alert('Materiais importados com sucesso!');
        } catch (error) {
          alert('Erro ao importar arquivo. Verifique se está no formato correto.');
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadTemplate = () => {
    const template = `Nome,Quantidade,Unidade,Quantidade Mínima,Projeto
Cimento,100,kg,20,Projeto A
Areia,50,m³,10,Projeto B`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_materiais.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Importar Materiais</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Download className="h-5 w-5" />
            <span>Baixar Planilha Modelo</span>
          </button>
          
          <div className="relative">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 cursor-pointer text-green-600 hover:text-green-800"
            >
              <Upload className="h-5 w-5" />
              <span>Importar Planilha</span>
            </label>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">Instruções:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Baixe a planilha modelo</li>
            <li>Preencha os dados dos materiais seguindo o formato</li>
            <li>Salve como CSV</li>
            <li>Importe o arquivo preenchido</li>
          </ul>
        </div>
      </div>
    </div>
  );
}