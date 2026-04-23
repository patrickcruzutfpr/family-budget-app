import { useEffect } from 'react';
import { useI18n } from '@/i18n';
import { updateAllProfileCategoriesLanguage } from '@/services/profileService';

/**
 * Hook que monitora mudancas de idioma e atualiza todas as categorias
 * dos perfis para manter consistencia com o idioma selecionado.
 */
export const useDefaultProfileLanguageSync = () => {
  const { language } = useI18n();

  useEffect(() => {
    const updateAllCategories = () => {
      try {
        updateAllProfileCategoriesLanguage();
      } catch (error) {
        console.error('Error updating profile categories language:', error);
      }
    };

    const timeoutId = setTimeout(updateAllCategories, 100);

    return () => clearTimeout(timeoutId);
  }, [language]);
};

export default useDefaultProfileLanguageSync;
