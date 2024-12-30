import { useState, FormEvent } from 'react';
import { Transacao } from '../types';
import { useForm } from './useForm';
import { validarTransacao } from '../utils/validacoes';

export function useTransacaoForm(transacaoInicial: Transacao) {
  const [error, setError] = useState<string | null>(null);
  const { values, handleChange, reset, setValues } = useForm<Transacao>(transacaoInicial);

  const handleSubmit = async (e: FormEvent, onSuccess: (transacao: Transacao) => void) => {
    e.preventDefault();
    setError(null);

    try {
      validarTransacao(values);
      onSuccess(values);
      reset();
    } catch (err) {
      setError(err.message);
    }
  };

  return { 
    values, 
    handleChange, 
    reset, 
    setValues,
    handleSubmit,
    error 
  };
}