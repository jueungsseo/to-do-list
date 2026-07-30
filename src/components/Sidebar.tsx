import React from 'react';
import { 
  LayoutGrid, 
  AlertCircle, 
  CheckSquare, 
  Layers, 
  Settings, 
  HelpCircle, 
  LogOut,
  X
} from 'lucide-react';
import { NavTab, UserProfile } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userProfile: UserProfile;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const menuItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutGrid },
    { id: 'vital' as NavTab, label: 'Vital Task', icon: AlertCircle },
    { id: 'my-task' as NavTab, label: 'My Task', icon: CheckSquare },
    { id: 'categories' as NavTab, label: 'Task Categories', icon: Layers },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
    { id: 'help' as NavTab, label: 'Help', icon: HelpCircle },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Logo */}
        <div className="px-6 pt-6 pb-5 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-[#FF5F5E]">Dash</span>
            <span className="text-slate-900">board</span>
          </div>
          {isOpenMobile && (
            <button 
              onClick={onCloseMobile}
              className="p-1 text-slate-500 hover:text-slate-800 lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Sidebar Coral Profile Block */}
        <div className="mx-4 mb-6 p-5 rounded-2xl bg-[#FF5F5E] text-white flex flex-col items-center text-center shadow-sm relative overflow-hidden">
          {/* Subtle background glow circle */}
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          
          <div className="relative mb-3">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
          </div>
          <h3 className="font-semibold text-base leading-snug">{userProfile.name}</h3>
          <p className="text-xs text-white/80 mt-0.5 truncate max-w-full font-light">
            {userProfile.email}
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-white text-[#FF5F5E] shadow-sm font-semibold'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-[#FF5F5E]' : 'text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 mt-6">
        <button
          onClick={() => alert('Logged out successfully')}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-[#FF5F5E] rounded-2xl transition-colors hover:bg-white/60"
        >
          <LogOut className="w-5 h-5 text-slate-500 hover:text-[#FF5F5E]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 bg-[#F8FAFC] flex-shrink-0 rounded-l-3xl border-r border-slate-100">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-[#F8FAFC] z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
