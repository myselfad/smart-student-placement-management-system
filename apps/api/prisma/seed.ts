import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { PrismaClient, Role, DriveStatus, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

import prisma from '../src/lib/prisma';

const INDIAN_STUDENTS = [
  { name: 'Aarav Sharma', branch: 'Computer Science', cgpa: 9.1, year: 2025, email: 'aarav.sharma@sspms.edu' },
  { name: 'Priya Patel', branch: 'Information Technology', cgpa: 8.8, year: 2025, email: 'priya.patel@sspms.edu' },
  { name: 'Rahul Kumar', branch: 'Electronics', cgpa: 7.9, year: 2025, email: 'rahul.kumar@sspms.edu' },
  { name: 'Sneha Desai', branch: 'Computer Science', cgpa: 9.4, year: 2025, email: 'sneha.desai@sspms.edu' },
  { name: 'Vikram Singh', branch: 'Mechanical', cgpa: 8.2, year: 2025, email: 'vikram.singh@sspms.edu' },
  { name: 'Aditi Joshi', branch: 'Information Technology', cgpa: 8.5, year: 2026, email: 'aditi.joshi@sspms.edu' },
  { name: 'Karan Malhotra', branch: 'Computer Science', cgpa: 7.5, year: 2025, email: 'karan.malhotra@sspms.edu' },
  { name: 'Riya Gupta', branch: 'Electronics', cgpa: 9.0, year: 2026, email: 'riya.gupta@sspms.edu' },
  { name: 'Arjun Nair', branch: 'Computer Science', cgpa: 8.7, year: 2025, email: 'arjun.nair@sspms.edu' },
  { name: 'Megha Reddy', branch: 'Information Technology', cgpa: 8.3, year: 2026, email: 'megha.reddy@sspms.edu' },
  { name: 'Siddharth Iyer', branch: 'Mechanical', cgpa: 7.8, year: 2025, email: 'siddharth.iyer@sspms.edu' },
  { name: 'Neha Verma', branch: 'Computer Science', cgpa: 9.6, year: 2026, email: 'neha.verma@sspms.edu' },
  { name: 'Rohan Mehra', branch: 'Electronics', cgpa: 8.1, year: 2025, email: 'rohan.mehra@sspms.edu' },
  { name: 'Kritika Agarwal', branch: 'Information Technology', cgpa: 9.2, year: 2025, email: 'kritika.agarwal@sspms.edu' },
  { name: 'Varun Das', branch: 'Computer Science', cgpa: 8.4, year: 2026, email: 'varun.das@sspms.edu' },
  { name: 'Ananya Rao', branch: 'Computer Science', cgpa: 9.3, year: 2025, email: 'ananya.rao@sspms.edu' },
  { name: 'Devansh Pandey', branch: 'Electronics', cgpa: 7.6, year: 2025, email: 'devansh.pandey@sspms.edu' },
  { name: 'Isha Mistry', branch: 'Information Technology', cgpa: 8.9, year: 2026, email: 'isha.mistry@sspms.edu' },
  { name: 'Kabir Chawla', branch: 'Mechanical', cgpa: 8.0, year: 2025, email: 'kabir.chawla@sspms.edu' },
  { name: 'Shruti Jain', branch: 'Computer Science', cgpa: 9.5, year: 2025, email: 'shruti.jain@sspms.edu' },
];

const COMPANIES = [
  { name: 'TechNova', industry: 'Software', desc: 'Leading startup in AI.' },
  { name: 'TCS', industry: 'IT Services', desc: 'Global IT services and consulting.' },
  { name: 'Deloitte', industry: 'Consulting', desc: 'Audit, consulting, advisory.' },
  { name: 'Accenture', industry: 'IT Services', desc: 'Global professional services.' },
  { name: 'Infosys', industry: 'IT Services', desc: 'Next-generation digital services.' },
  { name: 'Capgemini', industry: 'IT Services', desc: 'Consulting, technology, outsourcing.' },
  { name: 'Cognizant', industry: 'IT Services', desc: 'Information technology, consulting.' }
];

async function main() {
  console.log('🌱 Starting database seed...');
  const defaultPassword = await bcrypt.hash('Student@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const editorPassword = await bcrypt.hash('Editor@123', 10);

  // 1. Create Admins
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sspms.edu' },
    update: { name: 'System Admin' },
    create: {
      email: 'admin@sspms.edu',
      passwordHash: adminPassword,
      role: Role.SUPER_ADMIN,
      name: 'System Admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'editor@sspms.edu' },
    update: { name: 'Placement Coordinator' },
    create: {
      email: 'editor@sspms.edu',
      passwordHash: editorPassword,
      role: Role.EDITOR,
      name: 'Placement Coordinator',
    },
  });

  // 2. Create Skills
  const commonSkills = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'C++', 'Data Analysis'];
  for (const skillName of commonSkills) {
    await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName }
    });
  }
  const allSkills = await prisma.skill.findMany();

  // 3. Create Students and Profiles
  const studentProfiles = [];
  for (const s of INDIAN_STUDENTS) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: { name: s.name },
      create: {
        email: s.email,
        passwordHash: defaultPassword,
        role: Role.STUDENT,
        name: s.name,
      }
    });

    let profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
    if (!profile) {
      profile = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          fullName: s.name,
          branch: s.branch,
          cgpa: s.cgpa,
          yearOfStudy: 4,
          graduationYear: s.year,
          profileCompletionPct: 90,
        }
      });
      // Add fake resume
      const resume = await prisma.resume.create({
        data: {
          studentProfileId: profile.id,
          fileUrl: 'https://example.com/resume.pdf',
          fileName: `${s.name.replace(' ', '_')}_Resume.pdf`,
        }
      });
      studentProfiles.push({ user, profile, resume });
    } else {
      const resume = await prisma.resume.findFirst({ where: { studentProfileId: profile.id } });
      if (resume) {
         studentProfiles.push({ user, profile, resume });
      } else {
        const newResume = await prisma.resume.create({
          data: {
            studentProfileId: profile.id,
            fileUrl: 'https://example.com/resume.pdf',
            fileName: `${s.name.replace(' ', '_')}_Resume.pdf`,
          }
        });
        studentProfiles.push({ user, profile, resume: newResume });
      }
    }
  }

  // 4. Create Companies
  const companyMap = new Map();
  for (const c of COMPANIES) {
    const company = await prisma.company.findFirst({ where: { name: c.name } });
    if (!company) {
      const newComp = await prisma.company.create({
        data: {
          name: c.name,
          description: c.desc,
          industry: c.industry
        }
      });
      companyMap.set(c.name, newComp);
    } else {
      companyMap.set(c.name, company);
    }
  }

  // 5. Create Drives
  const drivesData = [
    { companyName: 'TechNova', title: 'Software Engineer', comp: '12 LPA', type: 'Full-time', openings: 5, status: DriveStatus.OPEN },
    { companyName: 'TCS', title: 'Ninja Developer', comp: '5.5 LPA', type: 'Full-time', openings: 20, status: DriveStatus.CLOSED },
    { companyName: 'Deloitte', title: 'Technology Analyst', comp: '8.5 LPA', type: 'Full-time', openings: 8, status: DriveStatus.OPEN },
    { companyName: 'Accenture', title: 'Associate Software Engineer', comp: '6.5 LPA', type: 'Full-time', openings: 15, status: DriveStatus.OPEN },
    { companyName: 'Infosys', title: 'Systems Engineer', comp: '6 LPA', type: 'Full-time', openings: 30, status: DriveStatus.ARCHIVED },
    { companyName: 'Cognizant', title: 'GenC Developer', comp: '7.2 LPA', type: 'Full-time', openings: 12, status: DriveStatus.OPEN },
    { companyName: 'Capgemini', title: 'Senior Analyst', comp: '10 LPA', type: 'Full-time', openings: 4, status: DriveStatus.OPEN }
  ];

  const drives = [];
  for (const d of drivesData) {
    const comp = companyMap.get(d.companyName);
    let drive = await prisma.placementDrive.findFirst({ where: { companyId: comp.id, title: d.title } });
    if (!drive) {
      drive = await prisma.placementDrive.create({
        data: {
          companyId: comp.id,
          title: d.title,
          description: `Looking for skilled ${d.title}s to join our fast-growing team.`,
          location: 'Multiple Locations / Remote',
          compensation: d.comp,
          jobType: d.type,
          openings: d.openings,
          applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // +15 days
          status: d.status,
          createdByUserId: admin.id,
          eligibilityCriteria: {
            create: {
              minCgpa: 6.5,
              allowedBranches: ['Computer Science', 'Information Technology', 'Electronics'],
              allowedGraduationYears: [2025, 2026]
            }
          }
        }
      });
    }
    drives.push(drive);
  }

  // 6. Create Applications (Only if none exist, to keep it idempotent)
  const existingApps = await prisma.application.count();
  if (existingApps < 10 && studentProfiles.length > 0 && drives.length > 0) {
    console.log('Creating realistic applications...');
    
    // Aarav Sharma's Demo Journey
    const aarav = studentProfiles.find(s => s.profile.fullName === 'Aarav Sharma');
    const tcs = drives.find(d => d.title === 'Ninja Developer');
    const deloitte = drives.find(d => d.title === 'Technology Analyst');
    const techNova = drives.find(d => d.title === 'Software Engineer');

    if (aarav && tcs && deloitte && techNova) {
      // TCS -> Shortlisted
      const tcsApp = await prisma.application.create({
        data: {
          studentProfileId: aarav.profile.id,
          driveId: tcs.id,
          status: ApplicationStatus.SHORTLISTED,
          resumeId: aarav.resume.id
        }
      });
      await prisma.applicationStatusHistory.create({
        data: { applicationId: tcsApp.id, toStatus: ApplicationStatus.SHORTLISTED, changedByUserId: admin.id }
      });

      // Deloitte -> Interview
      const deloitteApp = await prisma.application.create({
        data: {
          studentProfileId: aarav.profile.id,
          driveId: deloitte.id,
          status: ApplicationStatus.TECHNICAL_INTERVIEW,
          resumeId: aarav.resume.id
        }
      });
      await prisma.applicationStatusHistory.create({
        data: { applicationId: deloitteApp.id, toStatus: ApplicationStatus.TECHNICAL_INTERVIEW, changedByUserId: admin.id }
      });

      // TechNova -> Selected
      const tnApp = await prisma.application.create({
        data: {
          studentProfileId: aarav.profile.id,
          driveId: techNova.id,
          status: ApplicationStatus.SELECTED,
          resumeId: aarav.resume.id
        }
      });
      await prisma.applicationStatusHistory.create({
        data: { applicationId: tnApp.id, toStatus: ApplicationStatus.SELECTED, changedByUserId: admin.id }
      });
    }

    // Randomize applications for the rest
    for (let i = 0; i < studentProfiles.length; i++) {
      if (studentProfiles[i].profile.fullName === 'Aarav Sharma') continue;

      const sp = studentProfiles[i];
      // Apply to 1-3 random drives
      const numApps = Math.floor(Math.random() * 3) + 1;
      const shuffledDrives = [...drives].sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < numApps; j++) {
        const drive = shuffledDrives[j];
        
        // Pick random status
        const statuses = [
          ApplicationStatus.APPLIED, ApplicationStatus.APPLIED, ApplicationStatus.APPLIED,
          ApplicationStatus.SHORTLISTED, ApplicationStatus.SHORTLISTED,
          ApplicationStatus.ASSESSMENT, ApplicationStatus.TECHNICAL_INTERVIEW,
          ApplicationStatus.REJECTED, ApplicationStatus.REJECTED, ApplicationStatus.SELECTED
        ];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Check if application exists
        const existingApp = await prisma.application.findFirst({
          where: { studentProfileId: sp.profile.id, driveId: drive.id }
        });

        if (!existingApp) {
          const app = await prisma.application.create({
            data: {
              studentProfileId: sp.profile.id,
              driveId: drive.id,
              status: status,
              resumeId: sp.resume.id,
              appliedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
            }
          });

          // Add history if status is not APPLIED
          if (status !== ApplicationStatus.APPLIED) {
            await prisma.applicationStatusHistory.create({
              data: {
                applicationId: app.id,
                fromStatus: ApplicationStatus.APPLIED,
                toStatus: status,
                changedByUserId: admin.id,
                changedAt: new Date()
              }
            });
          }
        }
      }
    }
  }

  // 7. Create Announcements
  const existingAnnouncements = await prisma.announcement.count();
  if (existingAnnouncements === 0) {
    const announcementsData = [
      { title: 'TechNova Placement Drive Registration Open', body: 'TechNova is visiting for SDE I roles with 12 LPA. Register before Friday.' },
      { title: 'TCS Pre-Placement Talk Scheduled', body: 'Mandatory pre-placement talk for all students applying to TCS Ninja.' },
      { title: 'Resume Verification Deadline', body: 'Please get your resumes verified by the placement cell by 15th October.' },
      { title: 'Technical Interview Guidelines', body: 'A quick handbook on clearing technical rounds has been uploaded to the student portal.' },
      { title: 'Accenture Shortlist Declared', body: 'Check your applications dashboard to see if you have been shortlisted for the assessment.' }
    ];

    for (const a of announcementsData) {
      await prisma.announcement.create({
        data: {
          title: a.title,
          body: a.body,
          audienceFilter: '{}',
          createdByUserId: admin.id,
        }
      });
    }
  }

  console.log('✅ Seeding complete!');
  console.log('--- DEMO ACCOUNTS ---');
  console.log('Admin: admin@sspms.edu / Admin@123');
  console.log('Demo Student: aarav.sharma@sspms.edu / Student@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
