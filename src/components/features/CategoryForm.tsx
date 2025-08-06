import React, { useState, useEffect } from 'react';
import { Category, CategoryFormData, CategoryType } from '../../types';
import { useI18n } from '../../i18n/context';

interface CategoryFormProps {
  category?: Category;
  mode: 'create' | 'edit';
  onSubmit: (formData: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  categoryNameExists: (name: string, excludeId?: string) => boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  mode,
  onSubmit,
  onCancel,
  loading = false,
  categoryNameExists
}) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    type: CategoryType.EXPENSE,
    description: '',
    icon: '',
    color: '#3B82F6'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && category) {
      setFormData({
        name: category.name,
        type: category.type,
        description: category.description || '',
        icon: category.icon || '',
        color: category.color || '#3B82F6'
      });
    }
  }, [mode, category]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('categoryManager.validation.nameRequired', 'Nome é obrigatório');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('categoryManager.validation.nameMinLength', 'Nome deve ter pelo menos 2 caracteres');
    } else if (categoryNameExists(formData.name.trim(), category?.id)) {
      newErrors.name = t('categoryManager.validation.nameExists', 'Uma categoria com este nome já existe');
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = t('categoryManager.validation.typeRequired', 'Tipo é obrigatório');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim()
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Available icons
  const availableIcons = [
    { value: '🏠', label: t('categoryManager.icons.house', 'Casa') },
    { value: '🚗', label: t('categoryManager.icons.transport', 'Transporte') },
    { value: '🍕', label: t('categoryManager.icons.food', 'Alimentação') },
    { value: '👨‍👩‍👧‍👦', label: t('categoryManager.icons.family', 'Família') },
    { value: '💰', label: t('categoryManager.icons.money', 'Dinheiro') },
    { value: '🎯', label: 'Meta' },
    { value: '🛒', label: t('categoryManager.icons.shopping', 'Compras') },
    { value: '⚡', label: 'Energia' },
    { value: '📱', label: t('categoryManager.icons.technology', 'Tecnologia') },
    { value: '🎓', label: t('categoryManager.icons.education', 'Educação') },
    { value: '🏥', label: t('categoryManager.icons.health', 'Saúde') },
    { value: '🎭', label: t('categoryManager.icons.entertainment', 'Entretenimento') }
  ];

  // Available colors
  const availableColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#6B7280', // Gray
    '#84CC16'  // Lime
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Name */}
      <div>
        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
          {t('categoryManager.categoryName', 'Nome da Categoria')} *
        </label>
        <input
          id="categoryName"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('categoryManager.categoryNamePlaceholder', 'Digite o nome da categoria')}
          disabled={loading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Category Type */}
      <div>
        <label htmlFor="categoryType" className="block text-sm font-medium text-gray-700 mb-1">
          {t('categoryManager.categoryType', 'Tipo')} *
        </label>
        <select
          id="categoryType"
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value as CategoryType)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        >
          <option value={CategoryType.EXPENSE}>{t('categoryManager.expense', 'Gasto')}</option>
          <option value={CategoryType.INCOME}>{t('categoryManager.income', 'Renda')}</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">
          {t('categoryManager.categoryDescription', 'Descrição (Opcional)')}
        </label>
        <textarea
          id="categoryDescription"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('categoryManager.categoryDescriptionPlaceholder', 'Digite uma descrição para a categoria')}
          rows={3}
          disabled={loading}
        />
      </div>

      {/* Icon Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('categoryManager.categoryIcon', 'Ícone')}
        </label>
        <div className="grid grid-cols-6 gap-2">
          {availableIcons.map((icon) => (
            <button
              key={icon.value}
              type="button"
              onClick={() => handleInputChange('icon', icon.value)}
              className={`p-2 text-xl border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formData.icon === icon.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              title={icon.label}
              disabled={loading}
            >
              {icon.value}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('categoryManager.categoryColor', 'Cor')}
        </label>
        <div className="flex gap-2 flex-wrap">
          {availableColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleInputChange('color', color)}
              className={`w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                formData.color === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
              disabled={loading}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={loading}
        >
          {t('categoryManager.cancel', 'Cancelar')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? t('common.loading', 'Carregando...') : mode === 'create' ? t('categoryManager.createCategory', 'Criar Categoria') : t('categoryManager.updateCategory', 'Atualizar Categoria')}
        </button>
      </div>
    </form>
  );
};
