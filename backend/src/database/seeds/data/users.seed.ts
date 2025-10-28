import { UserRole } from '../../../users/user.entity';

export interface SeedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const seedUsers: SeedUser[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Maria Silva',
    email: 'admin@test.com',
    password: 'password123',
    role: UserRole.ADMIN,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'João Santos',
    email: 'user@test.com',
    password: 'password123',
    role: UserRole.USER,
  },
];
