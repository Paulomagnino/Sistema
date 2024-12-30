import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useFinanceiro } from '../../hooks/useFinanceiro';

export function FinanceiroHeader() {
  const { transacoes } = useApp();
  const { calcularTotalReceitas, calcularTotalDespesas, calcularSaldo } = useFinanceiro();

  const totalReceitas = calcularTotalReceitas(transacoes);
  const totalDespesas = calcularTotalDespesas(transacoes);
  const saldo = calcularSaldo(transacoes);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Receitas</p>
            <p className="text-2xl font-bold text-green-600">
              {totalReceitas.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Despesas</p>
            <p className="text-2xl font-bold text-red-600">
              {totalDespesas.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </div>
          <TrendingDown className="h-8 w-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Saldo</p>
            <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {saldo.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-blue-500" />
        </div>
      </div>
    </div>
  );
}