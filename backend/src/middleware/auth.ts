import { NextFunction, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest, AuthUser } from '../types/auth.js';
import { env } from '../config/env.js';

const router = Router();

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access.' });
    }

    const decoded = jwt.verify(token, env.jwtSecret) as AuthUser;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expired or invalid.' });
  }
};

export const requireRole = (...roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;

  if (!userRole || !roles.includes(userRole)) {
    return res.status(403).json({ message: 'You do not have permission to access this resource.' });
  }

  return next();
};

router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res) => {
  return res.json({
    id: req.user?.id,
    email: req.user?.email,
    name: req.user?.name,
    role: req.user?.role,
  });
});

export default router;
