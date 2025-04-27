export enum CourseLevel {
  None = 0,
  First = 1,
  Second = 2,
  Third = 3,
  Fourth = 4
}

export enum CourseSemester {
  First = 1,
  Second = 2
}

export enum CourseType {
  Lecture = 0,
  Practical = 1
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

// Mock data - Replace with API calls later
export const mockCourses: Course[] = [
  {
    id: 1,
    code: 'COMP401',
    name: 'Data Structure',
    creditHours: 3,
    level: CourseLevel.First,
    semester: CourseSemester.Second,
    type: CourseType.Lecture,
    lectureHours: 2,
    dependencies: [101]
  },
  {
    id: 2,
    code: 'COMP402',
    name: 'Database Systems',
    creditHours: 3,
    level: CourseLevel.Second,
    semester: CourseSemester.First,
    type: CourseType.Lecture,
    lectureHours: 2,
    dependencies: [201]
  }
]; 