import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/summary', requireAuth, requireRole('ADMIN', 'ACCOUNTANT', 'TEACHER'), async (_req, res) => {
  try {
    const [students, teachers, staff, fees, expenses] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.staff.count(),
      prisma.fee.aggregate({ _sum: { amount: true } }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
    ]);

    return res.json({
      students,
      teachers,
      staff,
      totalFeeCollected: fees._sum.amount ?? 0,
      totalExpense: expenses._sum.amount ?? 0,
      upcomingExam: 'Mid Term Examination',
      pendingLeaves: 4,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch dashboard summary.' });
  }
});

export default router;
