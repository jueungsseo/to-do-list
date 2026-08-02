import React, { useEffect, useState } from 'react';
import { Search, Bell, Calendar as CalendarIcon, Menu, Monitor, Maximize2 } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNotifications: () => void;
  onOpenCalendar: () => void;
  onOpenMobileMenu: () => void;
  showDeskFrame: boolean;
  setShowDeskFrame: (show: boolean) => void;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenNotifications,
  onOpenCalendar,
  onOpenMobileMenu,
  showDeskFrame,
  setShowDeskFrame,
  unreadCount,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());
  const weekday = currentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = currentDateTime.toLocaleDateString('en-GB');
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 pt-2">
      {/* Search Bar & Mobile Toggle */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 lg:hidden hover:bg-slate-50 transition-colors"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            placeholder="Search your task here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5F5E]/20 shadow-2xs border border-transparent"
          />
          <button
            className="absolute right-1 p-2 bg-[#FF5F5E] text-white rounded-lg hover:bg-[#ff4948] transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Controls: Notifications, Calendar, Date & Frame Toggle */}
      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 bg-[#FF5F5E] text-white rounded-xl hover:bg-[#ff4a49] transition-colors shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-900 font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Calendar Button */}
          <button
            onClick={onOpenCalendar}
            className="p-2.5 bg-[#FF5F5E] text-white rounded-xl hover:bg-[#ff4a49] transition-colors shadow-2xs"
            title="Calendar"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>

          {/* Desk Frame Toggle */}
          <button
            onClick={() => setShowDeskFrame(!showDeskFrame)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white text-slate-700 text-xs font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Toggle Desk Backdrop View"
          >
            {showDeskFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#FF5F5E]" />
                <span>Clean View</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#FF5F5E]" />
                <span>Desk View</span>
              </>
            )}
          </button>
        </div>

        {/* Date Display */}
        <div className="text-right pl-2 border-l border-slate-200">
          <p className="text-sm font-semibold text-slate-800 leading-none">{weekday}</p>
          <p className="text-xs font-semibold text-[#00A3FF] mt-1 tracking-tight">
            {formattedDate} · {formattedTime}
          </p>
        </div>
      </div>
    </header>
  );
};
