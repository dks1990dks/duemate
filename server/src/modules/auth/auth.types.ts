export interface RegisterInput {
  name: string;
  email: string;
   phone: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}