import React from 'react';
import { UserPlus } from 'lucide-react';
import { TeamMember, UserProfile } from '../types';

interface GreetingSectionProps {
  userProfile: UserProfile;
  teamMembers: TeamMember[];
  onOpenInviteModal: () => void;
}

export const GreetingSection: React.FC<GreetingSectionProps> = ({
  userProfile,
  teamMembers,
  onOpenInviteModal,
}) => {
  const visibleMembers = teamMembers.slice(0, 4);
  const extraCount = Math.max(0, teamMembers.length - 4);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Greeting Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
          <span>Welcome back, {userProfile.name.split(' ')[0]}</span>
          <span className="text-2xl animate-bounce">👋</span>
        </h1>
      </div>

      {/* Team Avatars & Invite Button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center -space-x-2 overflow-hidden py-1">
          {visibleMembers.map((member) => (
            <img
              key={member.id}
              src={member.avatarUrl}
              alt={member.name}
              title={`${member.name} (${member.role})`}
              className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-2xs"
            />
          ))}
          {extraCount > 0 && (
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-semibold ring-2 ring-white shadow-2xs">
              +{extraCount}
            </div>
          )}
        </div>

        <button
          onClick={onOpenInviteModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FF5F5E] bg-white border border-[#FF5F5E] rounded-full hover:bg-[#FF5F5E]/10 transition-colors shadow-2xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Invite</span>
        </button>
      </div>
    </div>
  );
};
