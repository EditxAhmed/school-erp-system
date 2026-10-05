import { Prisma } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

export const toSafeUser = (user: {
  id: string;
  email: string;
  name: string;
  role: { name: string } | null;
}) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role?.name ?? 'USER',
});

export type PrismaAuthenticatedUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    role: { select: { name: true } };
  };
}>;
