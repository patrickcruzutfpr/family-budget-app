import React from 'react';
import { Category } from '../../types';
import { useI18n } from '../../i18n/context';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  category?: Category;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  category,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const { t } = useI18n();
  if (!isOpen || !category) return null;

  const hasItems = category.items && category.items.length > 0;
  const itemCount = category.items?.length || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onCancel} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('categoryManager.confirmDelete', 'Confirmar Exclusão')}
                </h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="space-y-3">
              <p className="text-gray-700">
                {t('categoryManager.confirmDeleteMessage', 'Tem certeza que deseja excluir a categoria')}{' '}
                <span className="font-semibold">"{category.name}"</span>?
              </p>
              
              {hasItems && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" 
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                        clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <h4 className="text-sm font-medium text-yellow-800">
                        {t('categoryManager.warningTitle', 'Atenção')}
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        {t('categoryManager.confirmDeleteWarning', `Esta categoria possui ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}. Todos os itens serão movidos para 'Outros' automaticamente.`)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              {t('categoryManager.cancel', 'Cancelar')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? t('common.loading', 'Carregando...') : t('categoryManager.delete', 'Excluir')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
