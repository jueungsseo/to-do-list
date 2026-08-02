import React from 'react';
import { AlertCircle, CalendarDays, Check, Edit2, Star, Trash2 } from 'lucide-react';
import { Task, TaskStatus } from '../types';

interface TaskDetailViewProps {
  task: Task;
  onGoBack: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleVital: (taskId: string) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const statusLabel: Record<TaskStatus, string> = {
  'Not Started': '시작 전',
  'In Progress': '진행 중',
  Completed: '완료',
};

const priorityLabel: Record<Task['priority'], string> = {
  Low: '낮음',
  Moderate: '보통',
  High: '높음',
  Vital: '중요',
};

const categoryLabel: Record<Task['category'], string> = {
  Work: '업무',
  Personal: '개인',
  Design: '디자인',
  Meeting: '회의',
  Event: '이벤트',
};

const statusTextClass: Record<TaskStatus, string> = {
  'Not Started': 'text-red-500',
  'In Progress': 'text-blue-600',
  Completed: 'text-emerald-600',
};

const getNextStatus = (status: TaskStatus): TaskStatus => {
  if (status === 'Not Started') return 'In Progress';
  if (status === 'In Progress') return 'Completed';
  return 'Not Started';
};

export const TaskDetailView: React.FC<TaskDetailViewProps> = ({
  task,
  onGoBack,
  onEditTask,
  onDeleteTask,
  onToggleVital,
  onUpdateStatus,
}) => {
  const formattedDueDate = task.dueDate
    ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('ko-KR')
    : '일정 없음';

  return (
    <section className="flex-1 animate-in fade-in duration-200">
      <div className="rounded-3xl border border-slate-200/90 bg-white/75 p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-[#FF5F5E]/10 p-2 text-[#FF5F5E]">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">할 일 상세</p>
              <h2 className="text-xl font-bold text-slate-900">내용을 확인하고 관리하세요</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoBack}
            className="text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-[#FF5F5E]"
          >
            돌아가기
          </button>
        </div>

        <div className="min-h-[560px] rounded-3xl border border-slate-200 bg-[#F7F9FD] p-5 shadow-inner sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div>
              {task.imageUrl ? (
                <img
                  src={task.imageUrl}
                  alt={task.title}
                  className="h-52 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
                />
              ) : (
                <div className="grid h-52 w-full place-items-center rounded-2xl border border-dashed border-slate-300 bg-white text-slate-300">
                  <CalendarDays className="h-12 w-12" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-normal text-slate-950">
                    {task.title}
                  </h1>
                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-slate-500">우선순위: </span>
                      <span className="font-semibold text-blue-600">{priorityLabel[task.priority]}</span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">상태: </span>
                      <span className={`font-semibold ${statusTextClass[task.status]}`}>
                        {statusLabel[task.status]}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">카테고리: </span>
                      <span className="font-semibold text-slate-700">{categoryLabel[task.category]}</span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">일정: </span>
                      <span className="font-semibold text-slate-700">{formattedDueDate}</span>
                    </p>
                    <p className="text-xs text-slate-400">등록일: {task.createdOn}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleVital(task.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    task.isVital
                      ? 'border-amber-200 bg-amber-50 text-amber-600'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-amber-600'
                  }`}
                >
                  <Star className={`h-4 w-4 ${task.isVital ? 'fill-amber-500' : ''}`} />
                  <span>{task.isVital ? '중요 표시됨' : '중요 표시'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-5 text-sm leading-7 text-slate-600">
            <p className="whitespace-pre-line">{task.description || '상세 설명이 없습니다.'}</p>

            <div className="rounded-2xl bg-white/70 p-4 text-xs text-slate-500">
              <p className="mb-2 flex items-center gap-1.5 font-bold text-slate-700">
                <AlertCircle className="h-4 w-4 text-[#FF5F5E]" />
                관리 팁
              </p>
              <p>진행 상황이 바뀌면 아래 상태 버튼으로 바로 변경하고, 내용이 달라지면 수정 버튼으로 업데이트하세요.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => onDeleteTask(task.id)}
              className="rounded-xl bg-[#FF5F5E] p-3 text-white shadow-sm transition hover:bg-[#ff4948]"
              title="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onEditTask(task)}
              className="rounded-xl bg-[#FF5F5E] p-3 text-white shadow-sm transition hover:bg-[#ff4948]"
              title="수정"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateStatus(task.id, getNextStatus(task.status))}
              className="rounded-xl bg-[#FF5F5E] p-3 text-white shadow-sm transition hover:bg-[#ff4948]"
              title="상태 변경"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
