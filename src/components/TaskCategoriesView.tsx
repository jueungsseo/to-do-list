import React, { useState } from 'react';
import { Layers, Briefcase, User, Palette, Users, Calendar } from 'lucide-react';
import { Task, TaskCategory, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface TaskCategoriesViewProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleVital: (taskId: string) => void;
  onOpenTask: (task: Task) => void;
}

export const TaskCategoriesView: React.FC<TaskCategoriesViewProps> = ({
  tasks,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
  onToggleVital,
  onOpenTask,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');
  const categoryLabels: Record<TaskCategory, string> = {
    Work: '업무',
    Personal: '개인',
    Design: '디자인',
    Meeting: '회의',
    Event: '이벤트',
  };

  const categories: { name: TaskCategory; icon: React.ElementType; color: string }[] = [
    { name: 'Work', icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
    { name: 'Personal', icon: User, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Design', icon: Palette, color: 'text-purple-600 bg-purple-50' },
    { name: 'Meeting', icon: Users, color: 'text-amber-600 bg-amber-50' },
    { name: 'Event', icon: Calendar, color: 'text-pink-600 bg-pink-50' },
  ];

  const filteredTasks =
    selectedCategory === 'All'
      ? tasks
      : tasks.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">카테고리</h2>
          <p className="text-xs text-slate-500">할 일을 성격별로 나누어 확인하세요.</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === 'All'
              ? 'bg-[#FF5F5E] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          전체 ({tasks.length})
        </button>

        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = tasks.filter((t) => t.category === cat.name).length;
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#FF5F5E] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : ''}`} />
              <span>{categoryLabels[cat.name]}</span>
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filtered Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 text-sm">이 카테고리에 할 일이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={onUpdateStatus}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onToggleVital={onToggleVital}
              onOpenTask={onOpenTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};
