import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export function EstoqueList() {
  const { materiais, projetos, estoque } = useApp();
  const [projetoSelecionado, setProjetoSelecionado] = useState('');
  const [busca, setBusca] = useState('');

  const estoqueComDetalhes = estoque.map(item => {
    const material = materiais.find(m => m.id === item.materialId);
    return {
      ...item,
      material
    };
  });

  const estoqueFiltrado = estoqueComDetalhes.filter(item => {
    if (!item.material) return false;

    const matchesBusca = 
      item.material.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      item.material.nome.toLowerCase().includes(busca.toLowerCase());
    
    const matchesProjeto = !projetoSelecionado || item.material.projeto === projetoSelecionado;
    
    return matchesBusca && matchesProjeto;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Posição do Estoque</h2>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código ou nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <select
            value={projetoSelecionado}
            onChange={(e) => setProjetoSelecionado(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos os Projetos</option>
            {projetos.map(projeto => (
              <option key={projeto.id} value={projeto.nome}>
                {projeto.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mínimo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {estoqueFiltrado.map((item) => {
              if (!item.material) return null;
              const abaixoMinimo = item.quantidade <= item.material.minimo;

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.material.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.material.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.material.unidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.material.minimo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {abaixoMinimo ? (
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-yellow-600">
                          Estoque Baixo
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-green-600">
                        Estoque Normal
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {estoqueFiltrado.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Nenhum item em estoque encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}