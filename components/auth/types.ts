// components/auth/types.ts

export interface User {
  _id: string;
  username: string;
  email?: string;
  bio?: string;
  avatarGradient?: string;
  savedProblems?: string[];
  completedProblems?: string[];
  savedJobs?: string[];
  jobApplications?: Record<string, string>;
  createdAt?: string;
  lastLoginAt?: string;
  hasPassword?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, inviteCode: string, password?: string) => Promise<void>;
  signup: (username: string, inviteCode: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}
