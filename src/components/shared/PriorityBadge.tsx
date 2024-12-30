import React from 'react';

interface PriorityBadgeProps {
  priority: 'baixa' | 'media' | 'alta';
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const getPriorityColor = () => {
    switch (priority) {
      case 'baixa':
        return 'bg-green-100 text-green-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'alta':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()} ${className}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}