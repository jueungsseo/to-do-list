import React from 'react';
import { PieChart } from 'lucide-react';
import { Task } from '../types';

interface TaskStatusDonutsProps {
  tasks: Task[];
}

export const TaskStatusDonuts: React.FC<TaskStatusDonutsProps> = ({ tasks }) => {
  // Calculate dynamic statistics
  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const notStartedCount = tasks.filter((t) => t.status === 'Not Started').length;

  // We calculate live percentages (fallback to snapshot defaults 84%, 46%, 13% if no tasks)
  const completedPct = total > 0 ? Math.round((completedCount / total) * 100) : 84;
  const inProgressPct = total > 0 ? Math.round((inProgressCount / total) * 100) : 46;
  const notStartedPct = total > 0 ? Math.round((notStartedCount / total) * 100) : 13;

  // Helper SVG Circular Donut Ring
  const renderRing = (percentage: number, strokeColor: string, label: string) => {
    const size = 72;
    const strokeWidth = 7;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {/* Background Circle Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              className="stroke-slate-100"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Value Arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* Centered Percentage Text */}
          <span className="absolute text-xs sm:text-sm font-bold text-slate-800">
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-[#FF5F5E]/10 text-[#FF5F5E]">
          <PieChart className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-[#FF5F5E]">할 일 현황</h2>
      </div>

      {/* 3 Donut Rings Row */}
      <div className="grid grid-cols-3 gap-2 py-2 items-center justify-items-center">
        {renderRing(completedPct, '#22C55E', '완료')}
        {renderRing(inProgressPct, '#2563EB', '진행 중')}
        {renderRing(notStartedPct, '#EF4444', '시작 전')}
      </div>

      {/* Legend Row */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>완료</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span>진행 중</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>시작 전</span>
        </div>
      </div>
    </div>
  );
};
