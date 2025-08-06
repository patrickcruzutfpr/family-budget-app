import { useEffect } from 'react';
import { useI18n } from '@/i18n';
import { checkAndUpdateDefaultProfileLanguage } from '@/services/profileService';

/**
 * Hook que monitora mudanças de idioma e atualiza as categorias padrão
 * quando necessário para manter consistência com o idioma selecionado
 */
export const useDefaultProfileLanguageSync = () => {
  const { language } = useI18n();

  useEffect(() => {
    // Verificar e atualizar perfil padrão quando o idioma mudar
    const updateDefaultProfile = () => {
      try {
        const wasUpdated = checkAndUpdateDefaultProfileLanguage();
        if (wasUpdated) {
          console.log('✅ Default profile updated to match current language:', language);
        }
      } catch (error) {
        console.error('❌ Error updating default profile language:', error);
      }
    };

    // Executar imediatamente
    updateDefaultProfile();

    // Também executar após um pequeno delay para garantir que o localStorage foi atualizado
    const timeoutId = setTimeout(updateDefaultProfile, 100);

    return () => clearTimeout(timeoutId);
  }, [language]);
};

export default useDefaultProfileLanguageSync;
