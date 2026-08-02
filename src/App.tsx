import React, { useEffect, useState } from 'react';
import { ClipboardList, CheckSquare, Plus } from 'lucide-react';
import {
  initialUserProfile,
  initialTeamMembers,
  initialNotifications,
} from './data/initialData';
import { Task, NavTab, TaskStatus, TeamMember, UserProfile } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GreetingSection } from './components/GreetingSection';
import { TaskCard } from './components/TaskCard';
import { TaskStatusDonuts } from './components/TaskStatusDonuts';
import { AddTaskModal } from './components/AddTaskModal';
import { InviteModal } from './components/InviteModal';
import { NotificationsPanel } from './components/NotificationsPanel';
import { CalendarPanel } from './components/CalendarPanel';
import { VitalTaskView } from './components/VitalTaskView';
import { TaskCategoriesView } from './components/TaskCategoriesView';
import { SettingsView } from './components/SettingsView';
import { HelpView } from './components/HelpView';
import { TaskDetailView } from './components/TaskDetailView';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { supabase } from './lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

const DEFAULT_AVATAR_URL =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  priority: Task['priority'];
  status: TaskStatus;
  category: Task['category'];
  due_date: string | null;
  image_url: string | null;
  is_vital: boolean;
  completed_at: string | null;
  created_at: string;
};

const formatDisplayDate = (dateValue?: string | null) => {
  if (!dateValue) return '';

  return new Date(dateValue).toLocaleDateString('en-GB');
};

const getCompletedLabel = (completedAt?: string | null) => {
  if (!completedAt) return undefined;

  const completedDate = new Date(completedAt);
  const diffMs = Date.now() - completedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return '오늘 완료했습니다.';
  if (diffDays === 1) return '어제 완료했습니다.';
  return `${diffDays}일 전에 완료했습니다.`;
};

const mapTaskRowToTask = (row: TaskRow): Task => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  priority: row.priority,
  status: row.status,
  category: row.category,
  createdOn: formatDisplayDate(row.created_at),
  dueDate: row.due_date || undefined,
  completedOn: formatDisplayDate(row.completed_at),
  timeAgo: getCompletedLabel(row.completed_at),
  imageUrl: row.image_url || undefined,
  isVital: row.is_vital,
});

export default function App() {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [notifications, setNotifications] = useState(initialNotifications);

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeskFrame, setShowDeskFrame] = useState(true);

  // Modals & Popovers
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const syncUserProfile = async (user: User | null) => {
    if (!user) {
      setUserProfile(initialUserProfile);
      return;
    }

    const metadata = user.user_metadata || {};
    let profile = null;

    if (supabase) {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, username, email')
        .eq('id', user.id)
        .maybeSingle();

      profile = data;
    }

    const firstName = profile?.first_name || metadata.first_name || '';
    const lastName = profile?.last_name || metadata.last_name || '';
    const username = profile?.username || metadata.username || '';
    const email = profile?.email || user.email || '';
    const displayName =
      [firstName, lastName].filter(Boolean).join(' ') || username || email || '사용자';

    setUserProfile({
      name: displayName,
      email,
      avatarUrl: metadata.avatar_url || DEFAULT_AVATAR_URL,
    });
  };

  const loadTasks = async (userId: string) => {
    if (!supabase) return;

    setIsTasksLoading(true);

    const { data, error } = await supabase
      .from('tasks')
      .select(
        'id, title, description, priority, status, category, due_date, image_url, is_vital, completed_at, created_at'
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('할 일을 불러오지 못했습니다.', error);
      setTasks([]);
      setIsTasksLoading(false);
      return;
    }

    setTasks((data || []).map((row) => mapTaskRowToTask(row as TaskRow)));
    setIsTasksLoading(false);
  };

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setIsAuthenticated(Boolean(data.session));
      if (data.session?.user) {
        setCurrentUser(data.session.user);
        await syncUserProfile(data.session.user);
        await loadTasks(data.session.user.id);
      }
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
      if (session?.user) {
        setCurrentUser(session.user);
        syncUserProfile(session.user);
        loadTasks(session.user.id);
      } else {
        setCurrentUser(null);
        setUserProfile(initialUserProfile);
        setTasks([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Task Handlers
  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdOn'> & { id?: string }) => {
    if (!supabase || !currentUser) {
      return;
    }

    const completedAt = taskData.status === 'Completed' ? new Date().toISOString() : null;

    const taskPayload = {
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate || null,
      priority: taskData.priority,
      status: taskData.status,
      category: taskData.category,
      image_url: taskData.imageUrl || null,
      is_vital: Boolean(taskData.isVital),
      completed_at: completedAt,
    };

    if (taskData.id) {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskPayload)
        .eq('id', taskData.id)
        .eq('user_id', currentUser.id)
        .select(
          'id, title, description, priority, status, category, due_date, image_url, is_vital, completed_at, created_at'
        )
        .single();

      if (error) {
        console.error('할 일을 수정하지 못했습니다.', error);
        return;
      }

      const updatedTask = mapTaskRowToTask(data as TaskRow);
      setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    } else {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskPayload,
          user_id: currentUser.id,
        })
        .select(
          'id, title, description, priority, status, category, due_date, image_url, is_vital, completed_at, created_at'
        )
        .single();

      if (error) {
        console.error('할 일을 저장하지 못했습니다.', error);
        return;
      }

      setTasks((prev) => [mapTaskRowToTask(data as TaskRow), ...prev]);
    }

    setNewTaskDueDate('');
  };

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    if (!supabase || !currentUser) {
      return;
    }

    const completedAt = newStatus === 'Completed' ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: newStatus,
        completed_at: completedAt,
      })
      .eq('id', taskId)
      .eq('user_id', currentUser.id)
      .select(
        'id, title, description, priority, status, category, due_date, image_url, is_vital, completed_at, created_at'
      )
      .single();

    if (error) {
      console.error('할 일 상태를 변경하지 못했습니다.', error);
      return;
    }

    const updatedTask = mapTaskRowToTask(data as TaskRow);
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!supabase || !currentUser) {
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', currentUser.id);

    if (error) {
      console.error('할 일을 삭제하지 못했습니다.', error);
      return;
    }

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTaskId((prev) => (prev === taskId ? null : prev));
  };

  const handleToggleVital = async (taskId: string) => {
    if (!supabase || !currentUser) {
      return;
    }

    const targetTask = tasks.find((task) => task.id === taskId);
    if (!targetTask) return;

    const { data, error } = await supabase
      .from('tasks')
      .update({ is_vital: !targetTask.isVital })
      .eq('id', taskId)
      .eq('user_id', currentUser.id)
      .select(
        'id, title, description, priority, status, category, due_date, image_url, is_vital, completed_at, created_at'
      )
      .single();

    if (error) {
      console.error('중요 할 일 설정을 변경하지 못했습니다.', error);
      return;
    }

    const updatedTask = mapTaskRowToTask(data as TaskRow);
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const handleAddMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `m-${Date.now()}`,
    };
    setTeamMembers((prev) => [...prev, newMember]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Filter tasks by Search Query
  const searchFilteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // To-Do tasks (Not Started + In Progress)
  const todoTasks = searchFilteredTasks.filter((t) => t.status !== 'Completed');
  // Completed tasks
  const completedTasks = searchFilteredTasks.filter((t) => t.status === 'Completed');
  const selectedTask = selectedTaskId
    ? tasks.find((task) => task.id === selectedTaskId) || null
    : null;

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const todayLabel = new Date().toLocaleDateString('ko-KR', {
    day: 'numeric',
    month: 'long',
  });

  const handleLogin = async ({ user }: { user?: User | null } = {}) => {
    setIsAuthenticated(true);
    if (user) {
      setCurrentUser(user);
      await syncUserProfile(user);
      await loadTasks(user.id);
    }
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserProfile(initialUserProfile);
    setTasks([]);
    setSelectedTaskId(null);
    setActiveTab('dashboard');
    setSearchQuery('');
    setIsMobileSidebarOpen(false);
  };

  if (isAuthLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FFE8E8] font-sans text-sm font-semibold text-slate-600">
        불러오는 중...
      </div>
    );
  }

  if (!isAuthenticated) {
    return activeTab === 'signup' ? (
      <SignUp onOpenSignIn={() => setActiveTab('dashboard')} />
    ) : (
      <Login onLogin={handleLogin} onOpenSignUp={() => setActiveTab('signup')} />
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 font-sans ${
        showDeskFrame
          ? 'bg-slate-900/90 p-2 sm:p-6 md:p-10 flex items-center justify-center relative overflow-x-hidden'
          : 'bg-[#F0F3F8]'
      }`}
      style={
        showDeskFrame
          ? {
              backgroundImage: 'linear-gradient(135deg, #2F2930 0%, #5A4540 52%, #2B3340 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Main Application Outer Container */}
      <div
        className={`w-full max-w-7xl bg-[#F0F3F8] flex flex-col lg:flex-row transition-all duration-300 ${
          showDeskFrame
            ? 'rounded-[28px] sm:rounded-[36px] shadow-2xl border border-white/20 my-auto overflow-hidden ring-1 ring-black/5'
            : 'min-h-screen'
        }`}
      >
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setSelectedTaskId(null);
            setActiveTab(tab);
          }}
          userProfile={userProfile}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 xl:p-8 flex flex-col min-w-0 relative">
          {/* Header Bar */}
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenNotifications={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsCalendarOpen(false);
            }}
            onOpenCalendar={() => {
              setIsCalendarOpen(!isCalendarOpen);
              setIsNotificationsOpen(false);
            }}
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            showDeskFrame={showDeskFrame}
            setShowDeskFrame={setShowDeskFrame}
            unreadCount={unreadNotificationCount}
          />

          {/* Notifications Dropdown */}
          <NotificationsPanel
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            onMarkAllRead={handleMarkAllNotificationsRead}
          />

          {/* Calendar Dropdown */}
          <CalendarPanel
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            tasks={tasks}
            onAddSchedule={(date) => {
              setTaskToEdit(null);
              setNewTaskDueDate(date);
              setIsCalendarOpen(false);
              setIsAddTaskOpen(true);
            }}
          />

          {/* Tab Views */}
          {selectedTask && (
            <TaskDetailView
              task={selectedTask}
              onGoBack={() => setSelectedTaskId(null)}
              onUpdateStatus={handleUpdateStatus}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsAddTaskOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onToggleVital={handleToggleVital}
            />
          )}

          {!selectedTask && activeTab === 'dashboard' && (
            <div className="space-y-6 flex-1">
              {/* Welcome Greeting & Team */}
              <GreetingSection
                userProfile={userProfile}
                teamMembers={teamMembers}
                onOpenInviteModal={() => setIsInviteOpen(true)}
              />

              {/* Main Dashboard 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: To-Do Section (7 Cols) */}
                <div className="lg:col-span-7 bg-white/80 rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
                  {/* To-Do Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#FF5F5E]/10 text-[#FF5F5E]">
                        <ClipboardList className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-bold text-[#FF5F5E]">할 일</h2>
                    </div>

                    <button
                      onClick={() => {
                        setTaskToEdit(null);
                        setIsAddTaskOpen(true);
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#FF5F5E] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>할 일 추가</span>
                    </button>
                  </div>

                  {/* Subheader Date */}
                  <div className="text-xs font-medium text-slate-400">
                    {todayLabel} <span className="text-slate-300">•</span> 오늘
                  </div>

                  {/* To-Do Task Cards List */}
                  {todoTasks.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-xs">
                      {isTasksLoading ? '할 일을 불러오는 중입니다...' : '아직 해야 할 일이 없습니다.'}
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {todoTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onUpdateStatus={handleUpdateStatus}
                          onEditTask={(task) => {
                            setTaskToEdit(task);
                            setIsAddTaskOpen(true);
                          }}
                          onDeleteTask={handleDeleteTask}
                          onToggleVital={handleToggleVital}
                          onOpenTask={(task) => setSelectedTaskId(task.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Task Status Charts + Completed Tasks (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Task Status Overview Donut Charts */}
                  <TaskStatusDonuts tasks={searchFilteredTasks} />

                  {/* Completed Task Box */}
                  <div className="bg-white/80 rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#FF5F5E]/10 text-[#FF5F5E]">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-bold text-[#FF5F5E]">
                        완료한 일
                      </h2>
                    </div>

                    {/* Completed Task Cards List */}
                    {completedTasks.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        {isTasksLoading ? '할 일을 불러오는 중입니다...' : '완료한 일이 아직 없습니다.'}
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {completedTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onUpdateStatus={handleUpdateStatus}
                            onEditTask={(task) => {
                              setTaskToEdit(task);
                              setIsAddTaskOpen(true);
                            }}
                            onDeleteTask={handleDeleteTask}
                            onToggleVital={handleToggleVital}
                            onOpenTask={(task) => setSelectedTaskId(task.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedTask && activeTab === 'vital' && (
            <VitalTaskView
              tasks={searchFilteredTasks}
              onUpdateStatus={handleUpdateStatus}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsAddTaskOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onToggleVital={handleToggleVital}
              onOpenTask={(task) => setSelectedTaskId(task.id)}
              onOpenAddTask={() => {
                setTaskToEdit(null);
                setIsAddTaskOpen(true);
              }}
            />
          )}

          {!selectedTask && activeTab === 'my-task' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">내 할 일</h2>
                  <p className="text-xs text-slate-500">
                    등록된 할 일을 한눈에 확인하세요. ({searchFilteredTasks.length}개)
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTaskToEdit(null);
                    setIsAddTaskOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#FF5F5E] rounded-xl hover:bg-[#ff4948] transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>할 일 추가</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchFilteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdateStatus={handleUpdateStatus}
                    onEditTask={(task) => {
                      setTaskToEdit(task);
                      setIsAddTaskOpen(true);
                    }}
                    onDeleteTask={handleDeleteTask}
                    onToggleVital={handleToggleVital}
                    onOpenTask={(task) => setSelectedTaskId(task.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {!selectedTask && activeTab === 'categories' && (
            <TaskCategoriesView
              tasks={searchFilteredTasks}
              onUpdateStatus={handleUpdateStatus}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsAddTaskOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onToggleVital={handleToggleVital}
              onOpenTask={(task) => setSelectedTaskId(task.id)}
            />
          )}

          {!selectedTask && activeTab === 'settings' && (
            <SettingsView
              userProfile={userProfile}
              setUserProfile={setUserProfile}
            />
          )}

          {!selectedTask && activeTab === 'help' && <HelpView />}
        </main>
      </div>

      {/* Add / Edit Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
          setNewTaskDueDate('');
        }}
        onSaveTask={handleSaveTask}
        taskToEdit={taskToEdit}
        initialDueDate={newTaskDueDate}
      />

      {/* Team Invite Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
}
