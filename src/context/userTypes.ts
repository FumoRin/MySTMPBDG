// userTypes.ts
export interface User {
    _id: string;
    username: string;
    name: string; // Ensure 'name' is included
    email: string;
    role: "sysadmin" | "teacher" | "student";
    profile?: {
      full_name: string;
      phone?: string;
      address?: string;
      photo_url?: string;
    };
    student_info?: {
      department?: string;
      generation?: number;
      class?: string;
    };
    teacher_info?: {
      department?: string;
      subjects?: string[];
    };
    password?: string;
  }