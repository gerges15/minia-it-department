export enum CourseLevel {
  None = 0,
  First = 1,
  Second = 2,
  Third = 3,
  Fourth = 4,
}

export enum CourseSemester {
  First = 1,
  Second = 2,
}

export enum CourseType {
  Lecture = 0,
  Practical = 1,
}

export interface Course {
  id: number;
  code: string;
  name: string;
  creditHours: number;
  level: CourseLevel;
  semester: CourseSemester;
  type: CourseType;
  lectureHours: number;
  dependencies?: number[]; // Array of prerequisite course IDs
}

export interface CourseFormData {
  code: string;
  name: string;
  creditHours: number;
  level: CourseLevel;
  semester: CourseSemester;
  type: CourseType;
  lectureHours: number;
  dependencies?: string; // Comma-separated string of course codes for UI
}
