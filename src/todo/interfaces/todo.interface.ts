export interface ProjectInterface {
  id: string;
  name: string;
  icon: string;
  isSecret: boolean;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoInterface {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInterface {
  id: string;
  username: string;
  displayName: string;
  isAdmin: boolean;
}

export interface LoginResponseInterface {
  accessToken: string;
  tokenType: string;
  user: UserInterface;
}

export interface ProjectMemberInterface {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  invitedAt: string;
  username: string;
  displayName: string;
  isAdmin: boolean;
}

export interface MemoVersionInterface {
  id: string;
  memoId: string;
  version: number;
  content: string;
  createdAt: string;
}

export interface ArticleInterface {
  id: string;
  memoId: string;
  projectId: string;
  title: string;
  content: string;
  publishedVersion: number;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  projectName?: string;
  projectIcon?: string;
  isSecret?: boolean;
}

export interface DailyTaskTypeInterface {
  id: string;
  name: string;
  icon: string;
  color: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarDayInterface {
  date: string;
  completedCount: number;
  totalCount: number;
  ratio: number;
}

export interface CalendarMonthInterface {
  year: number;
  month: number;
  totalTaskTypes: number;
  days: CalendarDayInterface[];
}

export interface DayDetailInterface {
  date: string;
  tasks: {
    taskTypeId: string;
    name: string;
    icon: string;
    completed: boolean;
  }[];
}
