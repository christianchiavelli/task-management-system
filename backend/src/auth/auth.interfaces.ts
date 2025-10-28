import { UserRole } from '../users/user.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface JwtPayload {
  email: string;
  sub: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export interface AuthRequest extends Request {
  user: AuthenticatedUser;
}
