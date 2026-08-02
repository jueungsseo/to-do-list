import React from 'react';
import { AlertCircle, Plus } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface VitalTaskViewProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleVital: (taskId: string) => void;
  onOpenTask: (task: Task) => void;
  onOpenAddTask: () => void;
}

export const VitalTaskView: React.FC<VitalTaskViewProps> = ({
  tasks,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
  onToggleVital,
  onOpenTask,
  onOpenAddTask,
}) => {
  const vitalTasks = tasks.filter((t) => t.isVital || t.priority === 'Vital' || t.priority === 'High');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-100 text-red-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">중요 할 일</h2>
            <p className="text-xs text-slate-500">우선적으로 챙겨야 할 일을 모아봤어요.</p>
          </div>
        </div>

        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#FF5F5E] rounded-xl hover:bg-[#ff4948] transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>중요 할 일 추가</span>
        </button>
      </div>

      {vitalTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 text-sm">중요 표시된 할 일이 없습니다.</p>
          <p className="text-xs text-slate-400 mt-1">우선순위를 '중요' 또는 '높음'으로 설정하면 여기에 표시됩니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vitalTasks.map((task) => (
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
