import React from 'react';
import { LanguageDetectionDemo } from './debug';

/**
 * Test page for language detection functionality
 * Access via: http://localhost:5175/language-test (when implemented in routing)
 * Or by temporarily adding to App.tsx for testing
 */
export const LanguageTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <LanguageDetectionDemo />
      </div>
    </div>
  );
};

export default LanguageTestPage;
