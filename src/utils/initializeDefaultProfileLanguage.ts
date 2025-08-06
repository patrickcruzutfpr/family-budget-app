import { checkAndUpdateDefaultProfileLanguage } from '@/services/profileService';

/**
 * Inicializa e sincroniza o perfil padrão com o idioma atual
 * Esta função deve ser chamada quando a aplicação inicializa
 */
export const initializeDefaultProfileLanguage = () => {
  try {
    console.log('🚀 Initializing default profile language synchronization...');
    
    // Aguardar um pouco para garantir que o localStorage está acessível
    setTimeout(() => {
      const wasUpdated = checkAndUpdateDefaultProfileLanguage();
      
      if (wasUpdated) {
        console.log('✅ Default profile language synchronized with user preference');
      } else {
        console.log('✅ Default profile already matches current language');
      }
    }, 50);
    
  } catch (error) {
    console.error('❌ Error initializing default profile language:', error);
  }
};

export default initializeDefaultProfileLanguage;
