export enum Gender {
    Male = 0,
    Female = 1
}

export enum Role {
    Admin = 0,
    Staff = 1,
    Student = 2
}

export enum Level {
    None = 0,
    First = 1,
    Second = 2,
    Third = 3,
    Fourth = 4,
    Fifth = 5,
    Sixth = 6,
    Seventh = 7
}

export interface Student {
    id: string;
    fullId: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    role: Role;
    level: Level;
    dateOfBirth: string;
    userName: string;
}

export interface StudentFormData {
    firstName: string;
    lastName: string;
    gender: Gender;
    role: Role;
    level: Level;
    dateOfBirth: string;
    password: string;
}

export interface StudentSchedule {
    day: number;
    startFrom: number;
    endTo: number;
}

export interface StudentTableProps {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (studentId: string) => void;
    onViewSchedules: (studentId: string) => void;
}

export interface StudentFormProps {
    initialData?: StudentFormData;
    onSubmit: (data: StudentFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export interface ScheduleFormProps {
    studentId: string;
    onSubmit: (schedules: StudentSchedule[]) => void;
    onCancel: () => void;
} 