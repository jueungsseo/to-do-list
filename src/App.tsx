import React, { useState } from 'react';
import { ClipboardList, CheckSquare, Plus } from 'lucide-react';
import {
  initialTasks,
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
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';

const AUTH_STORAGE_KEY = 'todo-app-authenticated';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  );
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [notifications, setNotifications] = useState(initialNotifications);

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeskFrame, setShowDeskFrame] = useState(true);

  // Modals & Popovers
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Task Handlers
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdOn'> & { id?: string }) => {
    if (taskData.id) {
      // Edit
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t))
      );
    } else {
      // Create new
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdOn: new Date().toLocaleDateString('en-GB'), // e.g. "20/06/2023"
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            completedOn: newStatus === 'Completed' ? new Date().toLocaleDateString('en-GB') : undefined,
            timeAgo: newStatus === 'Completed' ? 'Completed just now.' : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleToggleVital = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isVital: !t.isVital } : t))
    );
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

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const handleLogin = () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setSearchQuery('');
    setIsMobileSidebarOpen(false);
  };

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
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url('https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1920&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Decorative Clipboard Visual Props for Desk Mode */}
      {showDeskFrame && (
        <>
          {/* Clipboard on left backdrop representation */}
          <div className="hidden xl:block absolute left-4 top-1/2 -translate-y-1/2 w-48 h-80 bg-[#D8C4B6] opacity-30 rounded-2xl rotate-[-8deg] pointer-events-none shadow-2xl" />
          {/* Keyboard edge right backdrop */}
          <div className="hidden xl:block absolute right-4 top-1/2 -translate-y-1/2 w-64 h-96 bg-slate-800 opacity-30 rounded-3xl rotate-[6deg] pointer-events-none shadow-2xl" />
        </>
      )}

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
          setActiveTab={setActiveTab}
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
          />

          {/* Tab Views */}
          {activeTab === 'dashboard' && (
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
                      <h2 className="text-base font-bold text-[#FF5F5E]">To-Do</h2>
                    </div>

                    <button
                      onClick={() => {
                        setTaskToEdit(null);
                        setIsAddTaskOpen(true);
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#FF5F5E] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add task</span>
                    </button>
                  </div>

                  {/* Subheader Date */}
                  <div className="text-xs font-medium text-slate-400">
                    20 June <span className="text-slate-300">•</span> Today
                  </div>

                  {/* To-Do Task Cards List */}
                  {todoTasks.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-xs">
                      No pending tasks found. All caught up!
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
                        Completed Task
                      </h2>
                    </div>

                    {/* Completed Task Cards List */}
                    {completedTasks.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No completed tasks yet.
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
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vital' && (
            <VitalTaskView
              tasks={searchFilteredTasks}
              onUpdateStatus={handleUpdateStatus}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsAddTaskOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onToggleVital={handleToggleVital}
              onOpenAddTask={() => {
                setTaskToEdit(null);
                setIsAddTaskOpen(true);
              }}
            />
          )}

          {activeTab === 'my-task' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">My Tasks</h2>
                  <p className="text-xs text-slate-500">
                    All tasks assigned to you across projects ({searchFilteredTasks.length}).
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
                  <span>Add Task</span>
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
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <TaskCategoriesView
              tasks={searchFilteredTasks}
              onUpdateStatus={handleUpdateStatus}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsAddTaskOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onToggleVital={handleToggleVital}
            />
          )}

          {activeTab === 'signup' && <SignUp onOpenSignIn={() => setActiveTab('dashboard')} />}

          {activeTab === 'settings' && (
            <SettingsView
              userProfile={userProfile}
              setUserProfile={setUserProfile}
            />
          )}

          {activeTab === 'help' && <HelpView />}
        </main>
      </div>

      {/* Add / Edit Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSaveTask={handleSaveTask}
        taskToEdit={taskToEdit}
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
