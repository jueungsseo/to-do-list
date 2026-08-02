import { Task, TeamMember, NotificationItem, UserProfile } from '../types';

export const initialUserProfile: UserProfile = {
  name: '주 은서',
  email: 'jes2705@naver.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: '친구 생일 파티 참석',
    description: '가는 길에 선물을 사고, 베이커리에서 케이크를 찾아가기. (오후 6시 | 프레시 엘리먼츠)',
    priority: 'Moderate',
    status: 'Not Started',
    category: 'Event',
    createdOn: '20/06/2023',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=300&q=80',
    isVital: true,
  },
  {
    id: 'task-2',
    title: '여행 서비스 랜딩 페이지 디자인',
    description: '오늘 안에 시안을 마무리하고 퇴근 전 클라이언트와 논의하기. (오후 4시 | 회의실)',
    priority: 'Moderate',
    status: 'In Progress',
    category: 'Design',
    createdOn: '20/06/2023',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=300&q=80',
    isVital: true,
  },
  {
    id: 'task-3',
    title: '최종 제품 발표 준비',
    description: '기능이 정상적으로 동작하는지 확인하고 필요한 자료를 정리하기. 발표 전 팀원들과 최종 점검하기.',
    priority: 'Moderate',
    status: 'In Progress',
    category: 'Work',
    createdOn: '19/06/2023',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80',
    isVital: false,
  },
  {
    id: 'task-4',
    title: '반려견 산책',
    description: '공원에 데려가고 간식도 챙기기.',
    priority: 'Low',
    status: 'Completed',
    category: 'Personal',
    createdOn: '18/06/2023',
    completedOn: '18/06/2023',
    timeAgo: '2일 전에 완료했습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
    isVital: false,
  },
  {
    id: 'task-5',
    title: '클라이언트 회의 진행',
    description: '클라이언트와 만나 요구사항을 최종 정리하기.',
    priority: 'High',
    status: 'Completed',
    category: 'Meeting',
    createdOn: '18/06/2023',
    completedOn: '18/06/2023',
    timeAgo: '2일 전에 완료했습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
    isVital: true,
  },
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'm1',
    name: '김민준',
    email: 'alex@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: '프로덕트 디자이너',
  },
  {
    id: 'm2',
    name: '이서연',
    email: 'sarah@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: '프론트엔드 개발자',
  },
  {
    id: 'm3',
    name: '박지훈',
    email: 'michael@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: '프로젝트 매니저',
  },
  {
    id: 'm4',
    name: '최유나',
    email: 'emily@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    role: 'QA 리드',
  },
  {
    id: 'm5',
    name: '김도윤',
    email: 'david@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    role: '백엔드 개발자',
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: '회의 알림',
    message: '오후 4시에 회의실에서 랜딩 페이지 논의가 있습니다.',
    time: '10분 전',
    read: false,
    type: 'meeting',
  },
  {
    id: 'n2',
    title: '새 할 일 등록',
    message: '최종 제품 발표 준비 마감일이 내일입니다.',
    time: '1시간 전',
    read: false,
    type: 'task',
  },
  {
    id: 'n3',
    title: '시스템 업데이트',
    message: '대시보드 통계가 최신 상태로 동기화되었습니다.',
    time: '3시간 전',
    read: true,
    type: 'system',
  },
];
