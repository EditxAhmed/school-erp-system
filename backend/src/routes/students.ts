import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/students', requireAuth, async (_req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        enrollments: {
          include: {
            section: true,
            academicYear: true,
          },
        },
      },
      orderBy: { grNumber: 'asc' },
      take: 12,
    });

    return res.json(students.map((student) => ({
      id: student.id,
      name: student.user.name,
      grNumber: student.grNumber,
      rollNumber: student.rollNumber,
      class: student.enrollments[0]?.section?.name ?? 'N/A',
      fatherName: student.fatherName,
      phone: student.phone ?? student.user.phone,
    })));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch students.' });
  }
});

export default router;
