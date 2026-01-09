export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermissions {
  admin: Permission[];
  manager: Permission[];
  user: Permission[];
}

// Route access configuration
export interface RouteConfig {
  path: string;
  allowedRoles: UserRole[];
  component: React.ComponentType;
  title: string;
  icon?: string;
}
