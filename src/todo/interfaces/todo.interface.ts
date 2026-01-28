export interface ProjectInterface {
  id: string;
  name: string;
  icon: string;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemoInterface {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoVersionInterface {
  id: string;
  memoId: string;
  version: number;
  content: string;
  createdAt: string;
}
