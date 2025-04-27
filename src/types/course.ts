export interface Course {
    id: number;
    code: string;
    name: string;
    year: 'First' | 'Second' | 'Third' | 'Fourth';
    semester: 'First' | 'Second';
    credits: number;
    instructor: string;
    prerequisites: string[];
    type: 'Theory' | 'Lab';
  }
  
  export interface CourseFormData {
    code: string;
    name: string;
    year: 'First' | 'Second' | 'Third' | 'Fourth';
    semester: 'First' | 'Second';
    credits: number;
    instructor: string;
    prerequisites: string;
    type: 'Theory' | 'Lab';
  }
  
  // mock data, Replace with API calls later
  export const mockCourses: Course[] = [
    {
      id: 1,
      code: 'COMP401',
      name: 'Data Structure',
      year: 'First',
      semester: 'Second',
      credits: 3,
      instructor: 'Dr. Mohamed Ahmed',
      prerequisites: ['COMP101'],
      type: 'Theory',
    },
    {
      id: 2,
      code: 'COMP402',
      name: 'Database Systems',
      year: 'Second',
      semester: 'First',
      credits: 3,
      instructor: 'Dr. David Nady',
      prerequisites: ['COMP201'],
      type: 'Theory',
    },
  ]; 