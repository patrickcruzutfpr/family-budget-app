import { useEffect } from 'react';
import { useI18n } from '@/i18n';
import { updateAllProfileCategoriesLanguage } from '@/services/profileService';

/**
 * Hook que monitora mudanças de idioma e atualiza todas as categorias
 * dos perfis para manter consistência com o idioma selecionado
 */
export const useProfileCategoriesLanguageSync = () => {
  const { language } = useI18n();

  useEffect(() => {
    // Atualizar categorias de todos os perfis quando o idioma mudar
    const updateAllCategories = () => {
      try {
        const wasUpdated = updateAllProfileCategoriesLanguage();
        if (wasUpdated) {
          console.log('✅ All profile categories updated to match current language:', language);
        }
      } catch (error) {
        console.error('❌ Error updating profile categories language:', error);
      }
    };

    // Executar após um pequeno delay para garantir que as traduções foram carregadas
    const timeoutId = setTimeout(updateAllCategories, 100);

    return () => clearTimeout(timeoutId);
  }, [language]);
};

export default useProfileCategoriesLanguageSync;
