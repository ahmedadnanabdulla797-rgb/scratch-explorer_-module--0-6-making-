
export enum LessonStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  COMPLETED = 'COMPLETED'
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'content' | 'project' | 'quiz';
  status: LessonStatus;
  content: string;
  stars: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
