import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.aiConversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.schoolSetting.deleteMany();
  await prisma.teacherRemark.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.studentDocument.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.financialReport.deleteMany();
  await prisma.salaryPayment.deleteMany();
  await prisma.salary.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.reportCard.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.gradingSystem.deleteMany();
  await prisma.examSubject.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.examType.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.student.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.section.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();

  // Create Roles and Permissions
  console.log('📋 Creating roles and permissions...');

  const permissions = [
    { name: 'manage_students', description: 'Can manage student information' },
    { name: 'manage_teachers', description: 'Can manage teacher information' },
    { name: 'manage_staff', description: 'Can manage staff information' },
    { name: 'view_attendance', description: 'Can view attendance' },
    { name: 'take_attendance', description: 'Can record attendance' },
    { name: 'view_marks', description: 'Can view marks' },
    { name: 'enter_marks', description: 'Can enter marks' },
    { name: 'view_finance', description: 'Can view financial reports' },
    { name: 'manage_finance', description: 'Can manage finance' },
    { name: 'manage_fees', description: 'Can manage fee collection' },
    { name: 'manage_exams', description: 'Can create and manage exams' },
    { name: 'view_reports', description: 'Can view reports' },
    { name: 'manage_users', description: 'Can manage user accounts' },
    { name: 'manage_roles', description: 'Can manage roles and permissions' },
    { name: 'view_audit_logs', description: 'Can view audit logs' },
    { name: 'manage_settings', description: 'Can manage school settings' },
  ];

  const createdPermissions = await Promise.all(
    permissions.map(perm => prisma.permission.create({ data: perm }))
  );

  const superAdminRole = await prisma.role.create({
    data: {
      name: 'SUPER_ADMIN',
      description: 'Full system access',
      permissions: { connect: createdPermissions.map(p => ({ id: p.id })) },
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'School administrator',
      permissions: { connect: createdPermissions.map(p => ({ id: p.id })) },
    },
  });

  const teacherRole = await prisma.role.create({
    data: {
      name: 'TEACHER',
      description: 'Class teacher',
      permissions: {
        connect: [
          createdPermissions.find(p => p.name === 'view_attendance'),
          createdPermissions.find(p => p.name === 'take_attendance'),
          createdPermissions.find(p => p.name === 'view_marks'),
          createdPermissions.find(p => p.name === 'enter_marks'),
        ].filter(Boolean).map(p => ({ id: p.id })),
      },
    },
  });

  const parentRole = await prisma.role.create({
    data: {
      name: 'PARENT',
      description: 'Parent/Guardian',
      permissions: { connect: [] },
    },
  });

  const studentRole = await prisma.role.create({
    data: {
      name: 'STUDENT',
      description: 'Student',
      permissions: { connect: [] },
    },
  });

  const accountantRole = await prisma.role.create({
    data: {
      name: 'ACCOUNTANT',
      description: 'Accountant',
      permissions: {
        connect: [
          createdPermissions.find(p => p.name === 'view_finance'),
          createdPermissions.find(p => p.name === 'manage_finance'),
          createdPermissions.find(p => p.name === 'manage_fees'),
        ].filter(Boolean).map(p => ({ id: p.id })),
      },
    },
  });

  // Create Admin User
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@usmanahmedschool.edu',
      password: adminPassword,
      name: 'Admin User',
      phone: '+923001234567',
      address: 'Usman Ahmed School, Karachi',
      roleId: adminRole.id,
      status: 'active',
    },
  });

  // Create Academic Year
  console.log('📅 Creating academic year...');
  const currentYear = new Date().getFullYear();
  const academicYear = await prisma.academicYear.create({
    data: {
      name: `${currentYear}-${currentYear + 1}`,
      startDate: new Date(currentYear, 3, 1),
      endDate: new Date(currentYear + 1, 2, 31),
      active: true,
    },
  });

  // Create Classes
  console.log('🏫 Creating classes...');
  const classes = await Promise.all(
    ['Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((name, idx) =>
      prisma.class.create({
        data: { name, classNumber: idx },
      })
    )
  );

  // Create Sections for each class
  console.log('📂 Creating sections...');
  const sectionsMap = new Map();
  for (const cls of classes) {
    const sections = await Promise.all(
      ['A', 'B', 'C'].map(sectionName =>
        prisma.section.create({
          data: {
            name: sectionName,
            classId: cls.id,
            capacity: 40,
          },
        })
      )
    );
    sectionsMap.set(cls.id, sections);
  }

  // Create Subjects
  console.log('📚 Creating subjects...');
  const subjects = await Promise.all(
    [
      { name: 'English', code: 'ENG', maxMarks: 100 },
      { name: 'Urdu', code: 'URD', maxMarks: 100 },
      { name: 'Mathematics', code: 'MATH', maxMarks: 100 },
      { name: 'Science', code: 'SCI', maxMarks: 100 },
      { name: 'Islamic Studies', code: 'ISL', maxMarks: 100 },
      { name: 'Social Studies', code: 'SS', maxMarks: 100 },
      { name: 'Computer', code: 'COMP', maxMarks: 100 },
      { name: 'Physical Education', code: 'PE', maxMarks: 100 },
    ].map(subject =>
      prisma.subject.create({
        data: { ...subject, classId: classes[0].id },
      })
    )
  );

  // Create Teachers
  console.log('👨‍🏫 Creating teachers...');
  const teacherNames = [
    'Mr. Ahmed Khan',
    'Mrs. Fatima Ahmad',
    'Mr. Hassan Ali',
    'Mrs. Ayesha Khan',
    'Mr. Muhammad Usman',
    'Mrs. Zainab Hassan',
    'Mr. Ali Raza',
    'Mrs. Hina Ahmed',
  ];

  const teachers = [];
  for (let i = 0; i < teacherNames.length; i++) {
    const password = await bcrypt.hash('Teacher123!', 10);
    const user = await prisma.user.create({
      data: {
        email: `teacher${i + 1}@usmanahmedschool.edu`,
        password,
        name: teacherNames[i],
        phone: `+923001234${560 + i}`,
        roleId: teacherRole.id,
        status: 'active',
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        employeeId: `EMP${1000 + i}`,
        qualification: 'B.A/B.Sc',
        experience: 5 + i,
        joiningDate: new Date(2020, 0, 1),
        department: 'Academics',
        designation: 'Teacher',
        subjectId: subjects[i % subjects.length].id,
      },
    });
    teachers.push(teacher);
  }

  // Assign class teachers
  console.log('👨‍🏫 Assigning class teachers...');
  let teacherIdx = 0;
  for (const [classId, sections] of sectionsMap) {
    for (const section of sections) {
      if (teacherIdx < teachers.length) {
        await prisma.section.update({
          where: { id: section.id },
          data: { classTeacherId: teachers[teacherIdx].id },
        });
        teacherIdx++;
      }
    }
  }

  // Create GR Numbering Settings
  console.log('🔢 Setting up GR numbering...');
  await prisma.schoolSetting.create({
    data: {
      key: 'gr_starting_number',
      value: '2255',
      dataType: 'number',
    },
  });

  await prisma.schoolSetting.create({
    data: {
      key: 'next_gr_number',
      value: '2255',
      dataType: 'number',
    },
  });

  // Create Students
  console.log('👨‍🎓 Creating students...');
  const firstNames = ['Ahmed', 'Ali', 'Hamza', 'Usman', 'Bilal', 'Hassan', 'Omar', 'Ibrahim', 'Khalid', 'Rizwan'];
  const lastNames = ['Khan', 'Ahmad', 'Ali', 'Hassan', 'Hussein', 'Ibrahim', 'Abdullah', 'Malik', 'Raza', 'Siddiqui'];
  const fatherNames = ['Mr. Muhammad', 'Mr. Abdul', 'Mr. Ahmed', 'Mr. Hassan', 'Mr. Khalid'];
  const motherNames = ['Mrs. Amna', 'Mrs. Nida', 'Mrs. Hina', 'Mrs. Zainab', 'Mrs. Fatima'];

  let grCounter = 2255;
  let studentCount = 0;
  const maxStudentsPerSection = 30;
  const targetTotalStudents = 1400;

  for (const [classId, classSections] of sectionsMap) {
    for (const section of classSections) {
      for (let i = 0; i < maxStudentsPerSection && studentCount < targetTotalStudents; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const studentName = `${firstName} ${lastName}`;
        const password = await bcrypt.hash('Student123!', 10);

        const user = await prisma.user.create({
          data: {
            email: `student${grCounter}@usmanahmedschool.edu`,
            password,
            name: studentName,
            roleId: studentRole.id,
            status: 'active',
          },
        });

        const student = await prisma.student.create({
          data: {
            userId: user.id,
            grNumber: grCounter,
            rollNumber: i + 1,
            fatherName: fatherNames[Math.floor(Math.random() * fatherNames.length)],
            motherName: motherNames[Math.floor(Math.random() * motherNames.length)],
            dateOfBirth: new Date(2005 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)),
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            cnic: `${10000 + Math.floor(Math.random() * 90000)}-${Math.floor(Math.random() * 900000) + 100000}-${Math.floor(Math.random() * 9) + 1}`,
          },
        });

        await prisma.enrollment.create({
          data: {
            studentId: student.id,
            classId,
            sectionId: section.id,
            academicYearId: academicYear.id,
            admissionDate: new Date(currentYear, 3, 1),
            status: 'active',
          },
        });

        grCounter++;
        studentCount++;

        if (studentCount % 100 === 0) {
          console.log(`  Created ${studentCount} students...`);
        }
      }
    }
  }

  // Update next GR number
  await prisma.schoolSetting.update({
    where: { key: 'next_gr_number' },
    data: { value: grCounter.toString() },
  });

  // Create Exam Types
  console.log('📝 Creating exam types...');
  const examTypes = await Promise.all(
    ['Monthly Test', 'Mid Term', 'Final Term', 'Annual Exam'].map(name =>
      prisma.examType.create({ data: { name } })
    )
  );

  // Create Grading System
  console.log('📊 Creating grading system...');
  const gradingSystem = await prisma.gradingSystem.create({
    data: {
      name: 'Standard Grading',
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

  // Create Fee Structures
  console.log('💰 Creating fee structures...');
  const feeStructure = await prisma.feeStructure.create({
    data: {
      name: 'Standard Fee',
      description: 'Regular monthly fee',
    },
  });

  // Create Expenses
  console.log('📊 Creating sample expenses...');
  for (let i = 0; i < 20; i++) {
    await prisma.expense.create({
      data: {
        category: ['Electricity', 'Internet', 'Maintenance', 'Stationery', 'Equipment'][Math.floor(Math.random() * 5)],
        description: 'Monthly utility expense',
        amount: 5000 + Math.random() * 10000,
        date: new Date(currentYear, i % 12, 1),
        status: 'completed',
      },
    });
  }

  // Create School Settings
  console.log('⚙️ Creating school settings...');
  await prisma.schoolSetting.create({
    data: {
      key: 'school_name',
      value: 'Usman Ahmed School',
    },
  });

  await prisma.schoolSetting.create({
    data: {
      key: 'school_address',
      value: 'Karachi, Pakistan',
    },
  });

  await prisma.schoolSetting.create({
    data: {
      key: 'school_phone',
      value: '+923001234567',
    },
  });

  await prisma.schoolSetting.create({
    data: {
      key: 'currency',
      value: 'PKR',
    },
  });

  console.log('✅ Database seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - ${classes.length} classes created`);
  console.log(`  - ${[...sectionsMap.values()].flat().length} sections created`);
  console.log(`  - ${teachers.length} teachers created`);
  console.log(`  - ${studentCount} students created (GR: 2255-${grCounter - 1})`);
  console.log(`  - Subjects, exams, and settings configured`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
