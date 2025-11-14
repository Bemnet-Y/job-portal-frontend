export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employer" | "jobseeker";
  status: "active" | "pending" | "suspended";
  profile?: {
    title?: string;
    skills?: string[];
    experience?: string;
    education?: string;
    resume?: string;
  };
  company?: {
    name: string;
    description: string;
    website?: string;
    logo?: string;
    businessLicense?: string;
    licenseVerified?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  category: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  employer: string | User;
  company: {
    name: string;
    logo?: string;
  };
  applications: string[];
  status: "active" | "closed" | "draft";
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  job: string | Job;
  candidate: string | User;
  coverLetter: string;
  resume: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
  createdBy: string;
}

export interface AuthResponse {
  token?: string;
  user: User;
  message?: string; // Add this line
}

export interface DashboardStats {
  totalUsers: number;
  totalEmployers: number;
  totalJobSeekers: number;
  totalJobs: number;
  totalApplications: number;
  pendingEmployers: number;
}
