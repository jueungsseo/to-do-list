import { Task, TeamMember, NotificationItem, UserProfile } from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Sundar Gurung',
  email: 'sundargurung360@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: "Attend Nischal's Birthday Party",
    description: "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements).....",
    priority: 'Moderate',
    status: 'Not Started',
    category: 'Event',
    createdOn: '20/06/2023',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=300&q=80',
    isVital: true,
  },
  {
    id: 'task-2',
    title: 'Landing Page Design for TravelDays',
    description: 'Get the work done by EOD and discuss with client before leaving. (4 PM | Meeting Room)',
    priority: 'Moderate',
    status: 'In Progress',
    category: 'Design',
    createdOn: '20/06/2023',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=300&q=80',
    isVital: true,
  },
  {
    id: 'task-3',
    title: 'Presentation on Final Product',
    description: 'Make sure everything is functioning and all the necessities are properly met. Prepare the team and get the documents ready for...',
    priority: 'Moderate',
    status: 'In Progress',
    category: 'Work',
    createdOn: '19/06/2023',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80',
    isVital: false,
  },
  {
    id: 'task-4',
    title: 'Walk the dog',
    description: 'Take the dog to the park and bring treats as well.',
    priority: 'Low',
    status: 'Completed',
    category: 'Personal',
    createdOn: '18/06/2023',
    completedOn: '18/06/2023',
    timeAgo: 'Completed 2 days ago.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
    isVital: false,
  },
  {
    id: 'task-5',
    title: 'Conduct meeting',
    description: 'Meet with the client and finalize requirements.',
    priority: 'High',
    status: 'Completed',
    category: 'Meeting',
    createdOn: '18/06/2023',
    completedOn: '18/06/2023',
    timeAgo: 'Completed 2 days ago.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
    isVital: true,
  },
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'm1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'Product Designer',
  },
  {
    id: 'm2',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'Frontend Engineer',
  },
  {
    id: 'm3',
    name: 'Michael Scott',
    email: 'michael@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'Project Manager',
  },
  {
    id: 'm4',
    name: 'Emily Watson',
    email: 'emily@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    role: 'QA Lead',
  },
  {
    id: 'm5',
    name: 'David Kim',
    email: 'david@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    role: 'Backend Developer',
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Meeting Reminder',
    message: 'Landing Page discussion at 4:00 PM in Meeting Room.',
    time: '10 mins ago',
    read: false,
    type: 'meeting',
  },
  {
    id: 'n2',
    title: 'New Task Assigned',
    message: 'Presentation on Final Product due tomorrow.',
    time: '1 hour ago',
    read: false,
    type: 'task',
  },
  {
    id: 'n3',
    title: 'System Update',
    message: 'Dashboard stats synced with Google Workspace.',
    time: '3 hours ago',
    read: true,
    type: 'system',
  },
];
