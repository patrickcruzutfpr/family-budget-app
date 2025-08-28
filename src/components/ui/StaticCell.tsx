import React from 'react';

interface StaticCellProps {
  value: string | number;
  className?: string;
}

export const StaticCell: React.FC<StaticCellProps> = ({ value, className = '' }) => {
  return (
    <div className={`py-1 px-2 text-sm ${className}`}>
      {value}
    </div>
  );
};