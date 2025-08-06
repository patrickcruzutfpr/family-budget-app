import { useI18n } from '@/i18n';

export const useBudgetMessages = () => {
  const { t } = useI18n();

  return {
    promptItemName: () => t('budget.itemName', 'Enter the name for the new item:'),
    confirmDelete: () => t('budget.confirmDelete', 'Are you sure you want to delete this item?'),
    confirmReset: () => t('budget.confirmReset', 'Are you sure you want to reset all data to the default budget? This cannot be undone.'),
  };
};
