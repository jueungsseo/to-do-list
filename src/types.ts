export type Priority = 'Low' | 'Moderate' | 'High' | 'Vital';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed';
export type TaskCategory = 'Work' | 'Personal' | 'Design' | 'Meeting' | 'Event';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  createdOn: string; // e.g. "20/06/2023"
  dueDate?: string;
  completedOn?: string;
  timeAgo?: string;
  imageUrl?: string;
  isVital?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'task' | 'meeting' | 'system';
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export type NavTab = 'dashboard' | 'vital' | 'my-task' | 'categories' | 'signup' | 'settings' | 'help';
