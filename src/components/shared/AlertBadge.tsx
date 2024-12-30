import React from 'react';
import { AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AlertBadgeProps {
  type: 'warning' | 'success' | 'info' | 'error';
  message: string;
  className?: string;
}

export function AlertBadge({ type, message, className = '' }: AlertBadgeProps) {
  const config = {
    warning: {
      icon: AlertTriangle,
      colors: 'bg-yellow-100 text-yellow-800',
    },
    success: {
      icon: CheckCircle,
      colors: 'bg-green-100 text-green-800',
    },
    info: {
      icon: Clock,
      colors: 'bg-blue-100 text-blue-800',
    },
    error: {
      icon: AlertCircle,
      colors: 'bg-red-100 text-red-800',
    },
  };

  const Icon = config[type].icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config[type].colors} ${className}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}