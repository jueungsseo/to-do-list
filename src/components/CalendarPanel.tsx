import React, { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Task } from '../types';

interface CalendarPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onAddSchedule: (date: string) => void;
}

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate = (dateKey: string) =>
  new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  isOpen,
  onClose,
  tasks,
  onAddSchedule,
}) => {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(today));

  if (!isOpen) return null;

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const monthLabel = visibleMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const scheduledTasks = tasks.filter((task) => task.dueDate);
  const selectedTasks = scheduledTasks.filter((task) => task.dueDate === selectedDate);

  const changeMonth = (amount: number) => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };

  return (
    <div className="absolute right-0 top-14 w-88 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#FF5F5E]" />
          <h3 className="font-bold text-slate-800 text-sm">{monthLabel}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded ml-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
          {days.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
          {Array.from({ length: firstDayOffset }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {dates.map((d) => {
            const dateKey = toDateKey(new Date(year, month, d));
            const isSelected = dateKey === selectedDate;
            const isToday = dateKey === toDateKey(today);
            const taskCount = scheduledTasks.filter((task) => task.dueDate === dateKey).length;

            return (
              <button
                key={d}
                onClick={() => setSelectedDate(dateKey)}
                className={`relative h-9 rounded-lg transition-colors text-slate-700 hover:bg-slate-100 ${
                  isSelected
                    ? 'bg-[#FF5F5E] text-white font-bold hover:bg-[#FF5F5E] shadow-2xs'
                    : isToday
                      ? 'bg-[#FF5F5E]/10 text-[#FF5F5E] font-bold'
                      : ''
                }`}
              >
                <span>{d}</span>
                {taskCount > 0 && (
                  <span
                    className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-[#FF5F5E]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-medium">
            Selected Date:
            <strong className="ml-1 text-slate-800">{formatDate(selectedDate)}</strong>
          </div>
          <button
            onClick={() => onAddSchedule(selectedDate)}
            className="inline-flex items-center gap-1 rounded-lg bg-[#FF5F5E] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#ff4a49]"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        <div className="mt-3 max-h-36 space-y-2 overflow-y-auto pr-1">
          {selectedTasks.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-3 py-3 text-center text-xs font-medium text-slate-400">
              No schedules for this date.
            </div>
          ) : (
            selectedTasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-bold text-slate-800">{task.title}</p>
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      task.status === 'Completed'
                        ? 'bg-emerald-500'
                        : task.status === 'In Progress'
                          ? 'bg-blue-600'
                          : 'bg-red-500'
                    }`}
                  />
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">
                  {task.description || task.category}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
