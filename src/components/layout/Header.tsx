import React from 'react';
import { RefreshCwIcon } from '@/assets/icons/RefreshCwIcon';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useI18n } from '@/i18n';

interface HeaderProps {
    onReset: () => void;
    onManageProfiles: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onManageProfiles }) => {
    const { t } = useI18n();
    
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                            {t('app.title', 'Family Budget App')}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSelector />
                        <button
                            onClick={onManageProfiles}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            aria-label={t('header.profiles', 'Profiles')}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <span>{t('header.profiles', 'Profiles')}</span>
                        </button>
                        <button
                            onClick={onReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            aria-label={t('header.reset', 'Reset')}
                        >
                            <RefreshCwIcon className="w-4 h-4" />
                            <span>{t('header.reset', 'Reset')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
