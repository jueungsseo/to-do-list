import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Save, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  setUserProfile,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({ name, email, avatarUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Settings</h2>
          <p className="text-xs text-slate-500">Manage your profile details and dashboard preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <img
              src={avatarUrl}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#FF5F5E] shadow-sm"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{name}</h3>
              <p className="text-xs text-slate-500">{email}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Avatar Image URL
            </label>
            <input
              type="url"
              required
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5F5E] hover:bg-[#ff4a49] text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
