import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CalendarPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarPanel: React.FC<CalendarPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  // June 2023 days matrix simulation
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#FF5F5E]" />
          <h3 className="font-bold text-slate-800 text-sm">June 2023</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded ml-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
          {days.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
          {/* Empty offset for Thursday start of June 2023 */}
          <div />
          <div />
          <div />
          <div />
          {dates.map((d) => {
            const isTargetDay = d === 20; // 20 June 2023 from screenshot
            return (
              <button
                key={d}
                className={`py-1.5 rounded-lg transition-colors text-slate-700 hover:bg-slate-100 ${
                  isTargetDay
                    ? 'bg-[#FF5F5E] text-white font-bold hover:bg-[#FF5F5E] shadow-2xs'
                    : ''
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>Selected Date: <strong className="text-slate-800">20 June 2023</strong></span>
        <span className="text-[#00A3FF] font-semibold">Today</span>
      </div>
    </div>
  );
};
