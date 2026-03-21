export interface IUserSession {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'creator' | 'admin';
}

export interface ICourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  creatorId: string;
  modules: IModule[];
}

export interface IModule {
  id: string;
  title: string;
  order: number;
  lessons: ILesson[];
}

export interface ILesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  type: 'video' | 'text' | 'quiz';
}

export interface IQuiz {
  id: string;
  title: string;
  questions: IQuestion[];
  score: number;
}

export interface IQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IStudentSubmission {
  studentId: string;
  courseId: string;
  progressPercentage: number;
  completedLessons: string[];
}
