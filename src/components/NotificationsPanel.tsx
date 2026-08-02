import React from 'react';
import { Bell, CheckCheck, Clock, X } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#FF5F5E]" />
          <h3 className="font-bold text-slate-800 text-sm">알림</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="text-[11px] text-[#FF5F5E] hover:underline font-medium flex items-center gap-1"
          >
            <CheckCheck className="w-3 h-3" />
            <span>모두 읽음</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mt-3 max-h-72 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            새 알림이 없습니다.
          </p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border text-xs transition-colors ${
                item.read
                  ? 'bg-slate-50/60 border-slate-100 text-slate-600'
                  : 'bg-[#FF5F5E]/5 border-[#FF5F5E]/20 text-slate-800 font-medium'
              }`}
            >
              <div className="flex items-center justify-between font-semibold mb-1">
                <span className="text-slate-900">{item.title}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-normal">
                  <Clock className="w-2.5 h-2.5" />
                  {item.time}
                </span>
              </div>
              <p className="text-slate-600 leading-snug">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
