import React from 'react';
import { Category, CategoryFormData } from '../../types';
import { CategoryForm } from './CategoryForm';

interface CategoryModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  category?: Category;
  onClose: () => void;
  onSubmit: (formData: CategoryFormData) => Promise<void>;
  loading?: boolean;
  categoryNameExists: (name: string, excludeId?: string) => boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  mode,
  category,
  onClose,
  onSubmit,
  loading = false,
  categoryNameExists
}) => {
  if (!isOpen) return null;

  const title = mode === 'create' ? 'Nova Categoria' : 'Editar Categoria';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1"
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <CategoryForm
              category={category}
              mode={mode}
              onSubmit={onSubmit}
              onCancel={onClose}
              loading={loading}
              categoryNameExists={categoryNameExists}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
