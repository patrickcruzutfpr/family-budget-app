import React, { useState } from 'react';
import { Category, CategoryType, CategoryFormData, CategoryModalState, DeleteConfirmationState } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { CategoryModal } from './CategoryModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface CategoryManagerProps {
  onCategoryChange?: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ onCategoryChange }) => {
  const {
    categories,
    loading: categoriesLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    categoryNameExists
  } = useCategories({ 
    onBudgetChange: onCategoryChange // Pass the callback to sync with budget
  });

  // Modal states
  const [modalState, setModalState] = useState<CategoryModalState>({
    isOpen: false,
    mode: 'create'
  });

  const [deleteState, setDeleteState] = useState<DeleteConfirmationState>({
    isOpen: false
  });

  const [operationLoading, setOperationLoading] = useState(false);

  // Separate categories by type
  const expenseCategories = categories.filter(cat => cat.type === CategoryType.EXPENSE);
  const incomeCategories = categories.filter(cat => cat.type === CategoryType.INCOME);

  // Handle create category
  const handleCreateCategory = () => {
    setModalState({
      isOpen: true,
      mode: 'create'
    });
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      category
    });
  };

  // Handle delete category request
  const handleDeleteRequest = (category: Category) => {
    setDeleteState({
      isOpen: true,
      category
    });
  };

  // Handle form submission
  const handleFormSubmit = async (formData: CategoryFormData) => {
    try {
      setOperationLoading(true);
      
      if (modalState.mode === 'create') {
        await createCategory(formData);
      } else if (modalState.category) {
        await updateCategory(modalState.category.id, formData);
      }
      
      // Close modal on success
      setModalState({ isOpen: false, mode: 'create' });
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error is handled by the hook
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteState.category) return;
    
    try {
      setOperationLoading(true);
      await deleteCategory(deleteState.category.id);
      setDeleteState({ isOpen: false });
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  // Close modals
  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'create' });
  };

  const closeDeleteModal = () => {
    setDeleteState({ isOpen: false });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calculate category totals
  const getCategoryTotal = (category: Category, field: 'projected' | 'actual') => {
    return category.items.reduce((sum, item) => sum + item[field], 0);
  };

  // Render category card
  const renderCategoryCard = (category: Category) => {
    const projectedTotal = getCategoryTotal(category, 'projected');
    const actualTotal = getCategoryTotal(category, 'actual');
    const itemCount = category.items.length;

    return (
      <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {category.icon && (
              <span className="text-xl">{category.icon}</span>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleEditCategory(category)}
              className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              title="Editar categoria"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleDeleteRequest(category)}
              className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              title="Excluir categoria"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Itens:</span>
            <span className="font-medium">{itemCount}</span>
          </div>
          
          {itemCount > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Projetado:</span>
                <span className="font-medium text-blue-600">{formatCurrency(projectedTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Realizado:</span>
                <span className={`font-medium ${actualTotal > projectedTotal ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(actualTotal)}
                </span>
              </div>
            </>
          )}
        </div>

        {category.color && (
          <div className="mt-3">
            <div 
              className="h-1 rounded-full" 
              style={{ backgroundColor: category.color }}
            />
          </div>
        )}
      </div>
    );
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando categorias...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h2>
          <p className="text-gray-600 mt-1">Organize suas categorias de renda e gastos</p>
        </div>
        <button
          onClick={handleCreateCategory}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Categoria
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Expense Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-red-600 mr-2">💸</span>
          Categorias de Gastos ({expenseCategories.length})
        </h3>
        
        {expenseCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map(renderCategoryCard)}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma categoria de gastos encontrada</p>
          </div>
        )}
      </div>

      {/* Income Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-green-600 mr-2">💰</span>
          Categorias de Renda ({incomeCategories.length})
        </h3>
        
        {incomeCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeCategories.map(renderCategoryCard)}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma categoria de renda encontrada</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        category={modalState.category}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        loading={operationLoading}
        categoryNameExists={categoryNameExists}
      />

      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        category={deleteState.category}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
        loading={operationLoading}
      />
    </div>
  );
};
