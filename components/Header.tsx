import React from 'react';
import { RefreshCwIcon } from './icons/RefreshCwIcon';

interface HeaderProps {
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                            Family Budget Workbook
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={onReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            aria-label="Reset Budget"
                        >
                            <RefreshCwIcon className="w-4 h-4" />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
