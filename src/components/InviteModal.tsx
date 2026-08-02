import React, { useState } from 'react';
import { X, Mail, UserPlus, Check } from 'lucide-react';
import { TeamMember } from '../types';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: Omit<TeamMember, 'id'>) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('기획자');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    // Random avatar
    const randomAvatar = `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?auto=format&fit=crop&w=150&q=80`;

    onAddMember({
      name: name.trim(),
      email: email.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role,
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setEmail('');
      setName('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#FF5F5E]" />
            <span>팀원 초대</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="py-8 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">초대를 보냈습니다</h3>
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-800">{email}</span>로 초대 메일을 보냈습니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                이름
              </label>
              <input
                type="text"
                required
                placeholder="예: 김민지"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                이메일 주소
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                역할
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/30 font-medium"
              >
                <option value="기획자">기획자</option>
                <option value="프론트엔드 개발자">프론트엔드 개발자</option>
                <option value="백엔드 개발자">백엔드 개발자</option>
                <option value="프로젝트 매니저">프로젝트 매니저</option>
                <option value="QA 담당자">QA 담당자</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#FF5F5E] hover:bg-[#ff4a49] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
              >
                초대 보내기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
