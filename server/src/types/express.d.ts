export {};

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}