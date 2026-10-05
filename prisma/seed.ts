import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  await prisma.aiChat.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.schoolSetting.deleteMany();
  await prisma.schoolStatus.deleteMany();
  await prisma.teacherRemark.deleteMany();
  await prisma.studentDocument.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.salaryPayment.deleteMany();
  await prisma.salary.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.gradingSystem.deleteMany();
  await prisma.examSubject.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.examType.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.student.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.section.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();

  const permissions = await Promise.all([
    { name: 'manage_students', description: 'Manage students' },
    { name: 'manage_teachers', description: 'Manage teachers' },
    { name: 'manage_staff', description: 'Manage staff' },
    { name: 'view_attendance', description: 'View attendance' },
    { name: 'take_attendance', description: 'Take attendance' },
    { name: 'view_marks', description: 'View marks' },
    { name: 'enter_marks', description: 'Enter marks' },
    { name: 'manage_fees', description: 'Manage fees' },
    { name: 'manage_finance', description: 'Manage finance' },
    { name: 'manage_exams', description: 'Manage exams' },
    { name: 'view_reports', description: 'View reports' },
    { name: 'manage_users', description: 'Manage users' },
    { name: 'manage_settings', description: 'Manage settings' },
    { name: 'view_audit_logs', description: 'View audit logs' },
  ].map((permission) => prisma.permission.create({ data: permission })));

  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'School administrator',
      permissions: { connect: permissions.map((p) => ({ id: p.id })) },
    },
  });

  const teacherRole = await prisma.role.create({
    data: {
      name: 'TEACHER',
      description: 'Teacher access',
      permissions: {
        connect: permissions.filter((p) => ['view_attendance', 'take_attendance', 'view_marks', 'enter_marks'].includes(p.name)).map((p) => ({ id: p.id })),
      },
    },
  });

  const parentRole = await prisma.role.create({
    data: {
      name: 'PARENT',
      description: 'Parent access',
      permissions: { connect: [] },
    },
  });

  const studentRole = await prisma.role.create({
    data: {
      name: 'STUDENT',
      description: 'Student access',
      permissions: { connect: [] },
    },
  });

  const accountantRole = await prisma.role.create({
    data: {
      name: 'ACCOUNTANT',
      description: 'Accountant access',
      permissions: {
        connect: permissions.filter((p) => ['manage_fees', 'manage_finance', 'view_reports'].includes(p.name)).map((p) => ({ id: p.id })),
      },
    },
  });

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@usmanahmedschool.edu',
      password: adminPassword,
      name: 'Usman Ahmed Admin',
      phone: '+923001234567',
      roleId: adminRole.id,
    },
  });

  const academicYear = await prisma.academicYear.create({
    data: {
      name: '2025-2026',
      startDate: new Date('2025-04-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T00:00:00.000Z'),
      active: true,
    },
  });

  const classList = await Promise.all([
    'Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
  ].map((name, index) =>
    prisma.class.create({
      data: {
        name,
        classNumber: index,
      },
    })
  ));

  const sectionMap = new Map<string, string[]>();
  for (const schoolClass of classList) {
    const sections = await Promise.all(['A', 'B', 'C'].map((sectionName) =>
      prisma.section.create({
        data: {
          name: sectionName,
          classId: schoolClass.id,
          capacity: 40,
        },
      })
    ));
    sectionMap.set(schoolClass.id, sections.map((section) => section.id));
  }

  const subjects = await Promise.all([
    { name: 'English', code: 'ENG' },
    { name: 'Urdu', code: 'URD' },
    { name: 'Mathematics', code: 'MATH' },
    { name: 'Science', code: 'SCI' },
    { name: 'Islamiyat', code: 'ISL' },
    { name: 'Social Studies', code: 'SOC' },
    { name: 'Computer', code: 'CMP' },
    { name: 'Physical Education', code: 'PE' },
  ].map((subject) => prisma.subject.create({
    data: {
      ...subject,
      classId: classList[2].id,
      maxMarks: 100,
      passingMarks: 40,
    },
  })));

  const teacherUsers = await Promise.all(
    ['Mr. Ahmed Khan', 'Mrs. Fatima Ali', 'Mr. Hassan Raza', 'Mrs. Ayesha Noor'].map(async (name, index) => {
      const user = await prisma.user.create({
        data: {
          email: `teacher${index + 1}@usmanahmedschool.edu`,
          password: await bcrypt.hash('Teacher123!', 10),
          name,
          phone: `+9230012345${index + 60}`,
          roleId: teacherRole.id,
        },
      });

      return prisma.teacher.create({
        data: {
          userId: user.id,
          employeeId: `EMP${1000 + index}`,
          qualification: 'M.A / M.Sc',
          experience: 5 + index,
          joiningDate: new Date('2020-01-01T00:00:00.000Z'),
          department: 'Academics',
          designation: 'Teacher',
        },
      });
    })
  );

  for (const [classId, sectionIds] of sectionMap.entries()) {
    for (const sectionId of sectionIds) {
      const teacher = teacherUsers[Math.floor(Math.random() * teacherUsers.length)];
      await prisma.section.update({
        where: { id: sectionId },
        data: { classTeacherId: teacher.id },
      });
    }
  }

  const gradingSystem = await prisma.gradingSystem.create({
    data: {
      name: 'Standard',
      grades: {
        create: [
          { grade: 'A+', minPercentage: 90, maxPercentage: 100 },
          { grade: 'A', minPercentage: 80, maxPercentage: 89 },
          { grade: 'B', minPercentage: 70, maxPercentage: 79 },
          { grade: 'C', minPercentage: 60, maxPercentage: 69 },
          { grade: 'D', minPercentage: 50, maxPercentage: 59 },
          { grade: 'F', minPercentage: 0, maxPercentage: 49 },
        ],
      },
    },
  });

  const feeStructure = await prisma.feeStructure.create({
    data: {
      name: 'Monthly Fee',
      description: 'Standard monthly school fee',
    },
  });

  const names = ['Ahmed', 'Ali', 'Hamza', 'Usman', 'Bilal', 'Hassan', 'Omar', 'Ibrahim', 'Raza', 'Ayesha'];
  const surnames = ['Khan', 'Ali', 'Hassan', 'Ahmed', 'Raza', 'Malik', 'Siddiqui', 'Noor'];
  let grNumber = 2255;

  for (let i = 0; i < 30; i++) {
    const firstName = names[(i + 3) % names.length];
    const lastName = surnames[i % surnames.length];
    const user = await prisma.user.create({
      data: {
        email: `student${i + 1}@usmanahmedschool.edu`,
        password: await bcrypt.hash('Student123!', 10),
        name: `${firstName} ${lastName}`,
        phone: `+92300${1000000 + i}`,
        roleId: studentRole.id,
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        grNumber,
        rollNumber: i + 1,
        fatherName: `Mr. ${firstName} Senior`,
        motherName: `Mrs. ${lastName}`,
        dateOfBirth: new Date(2013 + (i % 3), (i % 12), (i % 28) + 1),
        gender: i % 2 === 0 ? 'Male' : 'Female',
        cnic: `42101-${1000000 + i}-${(i % 9) + 1}`,
        address: 'Karachi, Pakistan',
        phone: `+92300${1000000 + i}`,
      },
    });

    const classId = classList[(i % classList.length)].id;
    const sectionId = sectionMap.get(classId)![i % 3];

    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        classId,
        sectionId,
        academicYearId: academicYear.id,
        admissionDate: new Date('2025-04-01T00:00:00.000Z'),
        status: 'active',
      },
    });

    await prisma.fee.create({
      data: {
        studentId: student.id,
        feeStructureId: feeStructure.id,
        amount: 3500,
        type: 'Monthly Fee',
        dueDate: new Date('2025-10-31T00:00:00.000Z'),
        status: i % 3 === 0 ? 'paid' : 'pending',
      },
    });

    grNumber += 1;
  }

  await prisma.schoolSetting.createMany({
    data: [
      { key: 'school_name', value: 'Usman Ahmed School', dataType: 'string' },
      { key: 'starting_gr_number', value: '2255', dataType: 'number' },
      { key: 'currency', value: 'PKR', dataType: 'string' },
      { key: 'academic_year', value: '2025-2026', dataType: 'string' },
    ],
  });

  await prisma.schoolStatus.createMany({
    data: [
      { key: 'students_total', value: '1400' },
      { key: 'teachers_total', value: '100' },
      { key: 'system_status', value: 'Operational' },
    ],
  });

  await prisma.notice.createMany({
    data: [{
      title: 'School Reopening',
      content: 'School will reopen for the new academic session on April 1st.',
      type: 'announcement',
      targetAudience: 'all',
      createdBy: adminUser.id,
      status: 'published',
    }],
  });

  await prisma.expense.createMany({
    data: [
      { category: 'Electricity', description: 'Monthly utility bill', amount: 45000, date: new Date('2025-09-01T00:00:00.000Z'), status: 'completed' },
      { category: 'Internet', description: 'Internet package', amount: 15000, date: new Date('2025-09-02T00:00:00.000Z'), status: 'completed' },
      { category: 'Maintenance', description: 'Ground upkeep', amount: 22000, date: new Date('2025-09-05T00:00:00.000Z'), status: 'completed' },
    ],
  });

  console.log('✅ Seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
