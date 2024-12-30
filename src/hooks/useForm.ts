import { useState, useEffect, ChangeEvent } from 'react';

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Ensure we never set undefined values
    let parsedValue: any = value;

    // Handle different input types
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setValues(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const reset = () => setValues(initialValues);

  return { 
    values, 
    handleChange, 
    reset, 
    setValues 
  };
}