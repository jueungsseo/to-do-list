import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Check, Edit2, Trash2, Star, CheckCircle2 } from 'lucide-react';
import { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleVital: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
  onToggleVital,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine status color styling matching the design
  const getStatusCircleStyle = () => {
    switch (task.status) {
      case 'Not Started':
        return 'border-2 border-red-500 text-transparent hover:text-red-500/30';
      case 'In Progress':
        return 'border-2 border-blue-600 text-transparent hover:text-blue-600/30';
      case 'Completed':
        return 'border-2 border-emerald-500 bg-emerald-500 text-white';
      default:
        return 'border-2 border-slate-300';
    }
  };

  const getStatusTextClass = () => {
    switch (task.status) {
      case 'Not Started':
        return 'text-red-500';
      case 'In Progress':
        return 'text-blue-600';
      case 'Completed':
        return 'text-emerald-600';
      default:
        return 'text-slate-600';
    }
  };

  const handleCircleClick = () => {
    // Cycle status: Not Started -> In Progress -> Completed -> Not Started
    if (task.status === 'Not Started') onUpdateStatus(task.id, 'In Progress');
    else if (task.status === 'In Progress') onUpdateStatus(task.id, 'Completed');
    else onUpdateStatus(task.id, 'Not Started');
  };

  return (
    <div className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
      <div className="flex items-start gap-3.5">
        {/* Circle Radio Status Indicator */}
        <button
          onClick={handleCircleClick}
          className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer ${getStatusCircleStyle()}`}
          title={`Click to change status (Current: ${task.status})`}
        >
          {task.status === 'Completed' ? (
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-current opacity-0 hover:opacity-100 transition-opacity" />
          )}
        </button>

        {/* Card Main Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 leading-snug truncate pr-2">
              {task.title}
            </h3>

            {/* Menu Dropdown Trigger */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Context Dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-6 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 text-xs">
                  <button
                    onClick={() => {
                      onEditTask(task);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Task</span>
                  </button>

                  <button
                    onClick={() => {
                      onToggleVital(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        task.isVital ? 'text-amber-500 fill-amber-500' : 'text-slate-500'
                      }`}
                    />
                    <span>{task.isVital ? 'Remove Vital' : 'Mark as Vital'}</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Change Status
                  </div>

                  <button
                    onClick={() => {
                      onUpdateStatus(task.id, 'Not Started');
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                  >
                    <span className="text-red-500">Not Started</span>
                    {task.status === 'Not Started' && <Check className="w-3 h-3 text-red-500" />}
                  </button>

                  <button
                    onClick={() => {
                      onUpdateStatus(task.id, 'In Progress');
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                  >
                    <span className="text-blue-600">In Progress</span>
                    {task.status === 'In Progress' && <Check className="w-3 h-3 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      onUpdateStatus(task.id, 'Completed');
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                  >
                    <span className="text-emerald-600">Completed</span>
                    {task.status === 'Completed' && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      onDeleteTask(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Task</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description & Optional Image */}
          <div className="flex items-start justify-between gap-3 mt-1.5">
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
              {task.description}
            </p>

            {task.imageUrl && (
              <img
                src={task.imageUrl}
                alt={task.title}
                className="w-18 h-16 sm:w-22 sm:h-18 rounded-xl object-cover flex-shrink-0 border border-slate-100 shadow-2xs"
              />
            )}
          </div>

          {/* Footer Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mt-3 pt-2 text-[11px] sm:text-xs">
            <div className="flex items-center gap-3">
              <span>
                <span className="text-slate-400">Priority: </span>
                <span className="text-blue-600 font-medium">{task.priority}</span>
              </span>

              <span>
                <span className="text-slate-400">Status: </span>
                <span className={`font-semibold ${getStatusTextClass()}`}>
                  {task.status}
                </span>
              </span>
            </div>

            <div className="text-slate-400">
              {task.timeAgo ? task.timeAgo : `Created on: ${task.createdOn}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
