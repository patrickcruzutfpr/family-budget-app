import React, { useState, useRef } from 'react';
import { useProfileManager } from '@/hooks';
import { useNotification } from '@/components/ui/Notification';
import { useFormatters } from '@/hooks';
import { useI18n } from '@/i18n';
import { ProfileSummary } from '@/types';
import { 
  UserIcon, 
  FolderIcon, 
  PlusCircleIcon, 
  Trash2Icon, 
  CopyIcon, 
  SaveIcon, 
  UploadIcon 
} from '@/assets/icons';

interface ProfileManagerProps {
  onProfileChange?: () => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ onProfileChange }) => {
  const {
    profiles,
    currentProfile,
    isLoading,
    error,
    switchProfile,
    createNewProfile,
    updateProfile,
    removeProfile,
    duplicateExistingProfile,
    exportProfileData,
    importProfileData,
    clearError,
  } = useProfileManager();
  const { showNotification } = useNotification();
  const { formatCurrency, formatDate } = useFormatters();
  const { t } = useI18n();

  // Utility function to translate default profile names and descriptions
  const translateProfileText = (text: string): string => {
    // Translate default profile names
    if (text === 'My First Budget') {
      return t('profiles.defaultProfileName', 'Meu Primeiro Orçamento');
    }
    if (text === 'Default family budget profile') {
      return t('profiles.defaultProfileDescription', 'Perfil padrão do orçamento familiar');
    }
    return text;
  };

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDescription, setNewProfileDescription] = useState('');
  const [basedOnCurrent, setBasedOnCurrent] = useState(false);
  const [importData, setImportData] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) {
      showNotification('error', 'validation.required');
      return;
    }
    
    try {
      await createNewProfile(newProfileName, newProfileDescription || undefined, basedOnCurrent);
      setShowCreateForm(false);
      setNewProfileName('');
      setNewProfileDescription('');
      setBasedOnCurrent(false);
      showNotification('success', 'messages.saveSuccess');
      onProfileChange?.();
    } catch (err) {
      showNotification('error', 'messages.saveError');
    }
  };

  const handleSwitchProfile = async (profileId: string) => {
    try {
      await switchProfile(profileId);
      
      // Dispatch event to notify that profile changed (triggers AI suggestions reload)
      const profileChangeEvent = new CustomEvent('profileChanged', {
        detail: { profileId, type: 'switched' }
      });
      window.dispatchEvent(profileChangeEvent);
      
      onProfileChange?.();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleUpdateProfile = async (profileId: string, name: string, description?: string) => {
    try {
      await updateProfile({ name, description });
      setEditingProfile(null);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      return;
    }
    
    try {
      await removeProfile(profileId);
      onProfileChange?.();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDuplicateProfile = async (profileId: string) => {
    const originalName = profiles.find(p => p.id === profileId)?.name || 'Unknown';
    const newName = prompt('Enter name for the duplicate:', `${originalName} (Copy)`);
    
    if (newName) {
      try {
        await duplicateExistingProfile(profileId, newName);
      } catch (err) {
        // Error is handled by the hook
      }
    }
  };

  const handleExportProfile = async (profileId: string) => {
    try {
      const data = await exportProfileData(profileId);
      const profileName = profiles.find(p => p.id === profileId)?.name || 'profile';
      
      // Create and download file
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_budget.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleImportProfile = async () => {
    if (!importData.trim()) return;
    
    try {
      const importedProfile = await importProfileData(importData);
      setShowImportForm(false);
      setImportData('');
      
      // Switch to the newly imported profile
      await switchProfile(importedProfile.id);
      
      // Dispatch event to notify that profile changed (triggers AI suggestions reload)
      const profileChangeEvent = new CustomEvent('profileChanged', {
        detail: { profileId: importedProfile.id, type: 'imported' }
      });
      window.dispatchEvent(profileChangeEvent);
      
      // Trigger budget reload in parent component
      onProfileChange?.();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
        setShowImportForm(true);
      };
      reader.readAsText(file);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <FolderIcon className="w-6 h-6 text-primary" />
          {t('profiles.title', 'Profile Manager')}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            title={t('profiles.createNew', 'Create New Profile')}
          >
            <PlusCircleIcon className="w-4 h-4" />
            {t('profiles.createNew', 'New')}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            title={t('profiles.import', 'Import Profile')}
          >
            <UploadIcon className="w-4 h-4" />
            {t('profiles.import', 'Import')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-700 hover:text-red-900">×</button>
        </div>
      )}

      {/* Current Profile Info */}
      {currentProfile && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-primary rounded-r-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                {t('profiles.currentProfile', 'Current Profile')}: {translateProfileText(currentProfile.name)}
              </h4>
              {currentProfile.description && (
                <p className="text-sm text-gray-600 mt-1">{translateProfileText(currentProfile.description)}</p>
              )}
            </div>
            <button
              onClick={() => setEditingProfile(currentProfile.id)}
              className="text-sm text-primary hover:text-secondary"
            >
              {t('profiles.edit', 'Edit')}
            </button>
          </div>
        </div>
      )}

      {/* Profile List */}
      <div className="space-y-3 mb-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`p-4 border rounded-lg transition-colors ${
              profile.id === currentProfile?.id
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {editingProfile === profile.id ? (
              <EditProfileForm
                profile={profile}
                onSave={handleUpdateProfile}
                onCancel={() => setEditingProfile(null)}
              />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800">{translateProfileText(profile.name)}</h4>
                    {profile.isDefault && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        {t('common.default', 'Default')}
                      </span>
                    )}
                    {profile.id === currentProfile?.id && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {t('common.active', 'Active')}
                      </span>
                    )}
                  </div>
                  {profile.description && (
                    <p className="text-sm text-gray-600 mt-1">{translateProfileText(profile.description)}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>{t('budget.income', 'Income')}: {formatCurrency(profile.totalIncome)}</span>
                    <span>{t('budget.expenses', 'Expenses')}: {formatCurrency(profile.totalExpenses)}</span>
                    <span>{profile.itemCount} {t('profiles.items', 'items')}</span>
                    <span>{t('profiles.updated', 'Updated')}: {formatDate(profile.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {profile.id !== currentProfile?.id && (
                    <button
                      onClick={() => handleSwitchProfile(profile.id)}
                      className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-secondary transition-colors"
                    >
                      {t('profiles.switchTo', 'Switch To')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDuplicateProfile(profile.id)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title={t('profiles.duplicate', 'Duplicate')}
                  >
                    <CopyIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExportProfile(profile.id)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title={t('profiles.export', 'Export')}
                  >
                    <SaveIcon className="w-4 h-4" />
                  </button>
                  {profiles.length > 1 && profile.id !== currentProfile?.id && (
                    <button
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title={t('profiles.delete', 'Delete')}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Profile Form */}
      {showCreateForm && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">{t('profiles.createNew', 'Create New Profile')}</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder={t('profiles.profileName', 'Profile name')}
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <textarea
              placeholder={t('profiles.profileDescription', 'Description (optional)')}
              value={newProfileDescription}
              onChange={(e) => setNewProfileDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={2}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={basedOnCurrent}
                onChange={(e) => setBasedOnCurrent(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">{t('profiles.basedOnCurrent', 'Based on current budget')}</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCreateProfile}
                disabled={!newProfileName.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:bg-gray-300 transition-colors"
              >
                {t('profiles.create', 'Create')}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewProfileName('');
                  setNewProfileDescription('');
                  setBasedOnCurrent(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                {t('profiles.cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Profile Form */}
      {showImportForm && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">{t('profiles.import', 'Import Profile')}</h4>
          <div className="space-y-3">
            <textarea
              placeholder={t('profiles.importData', 'Paste profile JSON data here...')}
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={handleImportProfile}
                disabled={!importData.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:bg-gray-300 transition-colors"
              >
                {t('profiles.import', 'Import')}
              </button>
              <button
                onClick={() => {
                  setShowImportForm(false);
                  setImportData('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                {t('profiles.cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Profile Form Component
interface EditProfileFormProps {
  profile: ProfileSummary;
  onSave: (profileId: string, name: string, description?: string) => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, onSave, onCancel }) => {
  const [name, setName] = useState(profile.name);
  const [description, setDescription] = useState(profile.description || '');
  const { t } = useI18n();

  const handleSave = () => {
    if (name.trim()) {
      onSave(profile.id, name.trim(), description.trim() || undefined);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t('profiles.profileDescription', 'Description (optional)')}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-secondary disabled:bg-gray-300 transition-colors"
        >
          {t('profiles.save', 'Save')}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
        >
          {t('profiles.cancel', 'Cancel')}
        </button>
      </div>
    </div>
  );
};
