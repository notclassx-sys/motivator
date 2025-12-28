
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  id: string;
  plannerId: string;
  title: string;
  description: string;
  priority: Priority;
  timeSlot?: string;
  completed: boolean;
  createdAt: number;
}

export interface Planner {
  id: string;
  name: string;
  icon: string;
  color: string;
  tasks: Task[];
}

export interface UserProfile {
  name: string;
  avatar: string;
  streak: number;
  badges: string[];
  theme: 'light' | 'dark';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type ViewType = 'plan-maker' | 'analytics' | 'home' | 'planner' | 'profile';
