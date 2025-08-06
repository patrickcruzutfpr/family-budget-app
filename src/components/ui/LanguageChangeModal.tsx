import React from 'react';
import { useI18n } from '@/i18n';
import { BookmarkIcon } from '@/assets/icons/BookmarkIcon';

interface LanguageChangeModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onSaveAndConfirm: () => void;
  hasUnsavedSuggestions: boolean;
  unsavedCount: number;
  targetLanguage: string;
}

export const LanguageChangeModal: React.FC<LanguageChangeModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  onSaveAndConfirm,
  hasUnsavedSuggestions,
  unsavedCount,
  targetLanguage
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookmarkIcon className="w-6 h-6 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-800">
            {t('ai.changeLanguageTitle', 'Change Language')}
          </h3>
        </div>

        <div className="mb-6">
          {hasUnsavedSuggestions ? (
            <div>
              <p className="text-gray-600 mb-3">
                {t('ai.unsavedWarning', `You have ${unsavedCount} unsaved AI suggestions.`)}
              </p>
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                {t('ai.unsavedWarningDetail', `These suggestions will be lost when changing to ${targetLanguage}. Would you like to save them first?`)}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">
              {t('ai.changeLanguageConfirm', `Are you sure you want to change the language to ${targetLanguage}?`)}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {hasUnsavedSuggestions && (
            <button
              onClick={onSaveAndConfirm}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              {t('ai.saveAndContinue', 'Save & Continue')}
            </button>
          )}
          
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors ${
              hasUnsavedSuggestions 
                ? 'bg-amber-500 text-white hover:bg-amber-600' 
                : 'flex-1 bg-primary text-white hover:bg-secondary'
            }`}
          >
            {hasUnsavedSuggestions 
              ? t('ai.continueWithoutSaving', 'Continue Without Saving')
              : t('common.ok', 'OK')
            }
          </button>
          
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            {t('common.cancel', 'Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
