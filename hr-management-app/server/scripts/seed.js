const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../backend/config.env') });

// Import models
const User = require('../models/User');
const Employee = require('../models/Employee');
const Candidate = require('../models/Candidate');
const OnboardingTask = require('../models/OnboardingTask');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms');
        console.log('MongoDB Connected for seeding...');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Seed data
const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Employee.deleteMany({});
        await Candidate.deleteMany({});
        await OnboardingTask.deleteMany({});

        console.log('Cleared existing data...');

        // Create admin user
        const adminUser = new User({
            email: 'admin@company.com',
            password: 'admin123',
            role: 'admin',
            profile: {
                firstName: 'Admin',
                lastName: 'User',
                department: 'HR',
                position: 'HR Manager'
            }
        });
        await adminUser.save();

        // Create employee user
        const employeeUser = new User({
            email: 'employee@company.com',
            password: 'employee123',
            role: 'employee',
            profile: {
                firstName: 'John',
                lastName: 'Doe',
                department: 'Engineering',
                position: 'Software Engineer'
            }
        });
        await employeeUser.save();

        console.log('Created users...');

        // Create employees
        const employees = [
            {
                fullName: 'John Doe',
                age: 28,
                email: 'john.doe@company.com',
                phone: '+84901234567',
                address: {
                    street: '123 Main Street',
                    city: 'Ho Chi Minh City',
                    state: 'Ho Chi Minh',
                    zipCode: '70000',
                    country: 'Vietnam'
                },
                department: 'Engineering',
                position: 'Software Engineer',
                contract: {
                    startDate: new Date('2023-01-15'),
                    endDate: null,
                    type: 'full-time',
                    salary: 25000000
                },
                workHistory: [
                    {
                        position: 'Junior Developer',
                        years: 2,
                        company: 'TechCorp',
                        startDate: new Date('2021-01-01'),
                        endDate: new Date('2022-12-31')
                    }
                ],
                skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                status: 'active',
                userId: employeeUser._id
            },
            {
                fullName: 'Jane Smith',
                age: 32,
                email: 'jane.smith@company.com',
                phone: '+84901234568',
                address: {
                    street: '456 Business Ave',
                    city: 'Hanoi',
                    state: 'Hanoi',
                    zipCode: '10000',
                    country: 'Vietnam'
                },
                department: 'Marketing',
                position: 'Marketing Manager',
                contract: {
                    startDate: new Date('2022-06-01'),
                    endDate: null,
                    type: 'full-time',
                    salary: 30000000
                },
                workHistory: [
                    {
                        position: 'Marketing Specialist',
                        years: 5,
                        company: 'Marketing Pro',
                        startDate: new Date('2017-06-01'),
                        endDate: new Date('2022-05-31')
                    }
                ],
                skills: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
                status: 'active'
            },
            {
                fullName: 'Mike Johnson',
                age: 45,
                email: 'mike.johnson@company.com',
                phone: '+84901234569',
                address: {
                    street: '789 Executive Blvd',
                    city: 'Da Nang',
                    state: 'Da Nang',
                    zipCode: '50000',
                    country: 'Vietnam'
                },
                department: 'Sales',
                position: 'Sales Director',
                contract: {
                    startDate: new Date('2021-03-01'),
                    endDate: null,
                    type: 'full-time',
                    salary: 40000000
                },
                workHistory: [
                    {
                        position: 'Sales Manager',
                        years: 8,
                        company: 'Sales Solutions',
                        startDate: new Date('2013-03-01'),
                        endDate: new Date('2021-02-28')
                    }
                ],
                skills: ['Sales Management', 'CRM', 'Lead Generation', 'Negotiation'],
                status: 'active'
            }
        ];

        for (const empData of employees) {
            const employee = new Employee(empData);
            await employee.save();
        }

        console.log('Created employees...');

        // Create candidates
        const candidates = [
            {
                name: 'Alice Wilson',
                email: 'alice.wilson@email.com',
                phone: '+84901234570',
                cvUrl: 'https://example.com/cv/alice-wilson.pdf',
                resumeText: 'Experienced frontend developer with 3 years of experience in React, Vue.js, and modern web technologies. Strong background in UI/UX design and responsive web development.',
                position: 'Frontend Developer',
                department: 'Engineering',
                experience: 3,
                skills: ['React', 'Vue.js', 'JavaScript', 'CSS', 'HTML', 'UI/UX Design'],
                education: {
                    degree: 'Bachelor of Computer Science',
                    university: 'University of Technology',
                    graduationYear: 2020,
                    gpa: 3.5
                },
                interviewStatus: 'interviewed',
                cvScore: 85,
                source: 'linkedin',
                expectedSalary: 20000000,
                availability: '2-weeks',
                applicationDate: new Date('2024-01-10'),
                assignedTo: adminUser._id
            },
            {
                name: 'Bob Chen',
                email: 'bob.chen@email.com',
                phone: '+84901234571',
                cvUrl: 'https://example.com/cv/bob-chen.pdf',
                resumeText: 'Backend developer specializing in Node.js, Python, and database design. Experience with microservices architecture and cloud deployment.',
                position: 'Backend Developer',
                department: 'Engineering',
                experience: 4,
                skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'],
                education: {
                    degree: 'Bachelor of Software Engineering',
                    university: 'National University',
                    graduationYear: 2019,
                    gpa: 3.7
                },
                interviewStatus: 'shortlisted',
                cvScore: 92,
                source: 'website',
                expectedSalary: 22000000,
                availability: 'immediate',
                applicationDate: new Date('2024-01-08'),
                assignedTo: adminUser._id
            },
            {
                name: 'Carol Davis',
                email: 'carol.davis@email.com',
                phone: '+84901234572',
                cvUrl: 'https://example.com/cv/carol-davis.pdf',
                resumeText: 'Digital marketing specialist with expertise in SEO, SEM, and social media marketing. Proven track record of increasing brand awareness and lead generation.',
                position: 'Digital Marketing Specialist',
                department: 'Marketing',
                experience: 2,
                skills: ['SEO', 'SEM', 'Google Ads', 'Facebook Ads', 'Analytics', 'Content Marketing'],
                education: {
                    degree: 'Bachelor of Marketing',
                    university: 'Business University',
                    graduationYear: 2021,
                    gpa: 3.3
                },
                interviewStatus: 'applied',
                cvScore: 78,
                source: 'job-board',
                expectedSalary: 15000000,
                availability: '1-month',
                applicationDate: new Date('2024-01-15'),
                assignedTo: adminUser._id
            }
        ];

        for (const candidateData of candidates) {
            const candidate = new Candidate(candidateData);
            await candidate.save();
        }

        console.log('Created candidates...');

        // Create onboarding tasks
        const onboardingTasks = [
            {
                employeeId: (await Employee.findOne({ email: 'john.doe@company.com' }))._id,
                taskName: 'Complete IT Equipment Setup',
                description: 'Set up laptop, email account, and access to company systems',
                status: 'completed',
                priority: 'high',
                dueDate: new Date('2023-01-20'),
                assignedTo: adminUser._id,
                category: 'equipment',
                completedDate: new Date('2023-01-18'),
                checklist: [
                    { item: 'Laptop assigned', completed: true, completedAt: new Date('2023-01-17') },
                    { item: 'Email account created', completed: true, completedAt: new Date('2023-01-17') },
                    { item: 'VPN access configured', completed: true, completedAt: new Date('2023-01-18') }
                ]
            },
            {
                employeeId: (await Employee.findOne({ email: 'john.doe@company.com' }))._id,
                taskName: 'Complete New Employee Orientation',
                description: 'Attend orientation session covering company policies and culture',
                status: 'completed',
                priority: 'medium',
                dueDate: new Date('2023-01-25'),
                assignedTo: adminUser._id,
                category: 'orientation',
                completedDate: new Date('2023-01-22')
            },
            {
                employeeId: (await Employee.findOne({ email: 'jane.smith@company.com' }))._id,
                taskName: 'Submit Required Documents',
                description: 'Submit tax forms, insurance documents, and emergency contact information',
                status: 'in-progress',
                priority: 'high',
                dueDate: new Date('2022-06-10'),
                assignedTo: adminUser._id,
                category: 'documentation',
                checklist: [
                    { item: 'Tax forms submitted', completed: true, completedAt: new Date('2022-06-08') },
                    { item: 'Insurance enrollment', completed: false },
                    { item: 'Emergency contact form', completed: false }
                ]
            },
            {
                employeeId: (await Employee.findOne({ email: 'mike.johnson@company.com' }))._id,
                taskName: 'Sales Training Program',
                description: 'Complete comprehensive sales training including CRM usage and sales processes',
                status: 'pending',
                priority: 'medium',
                dueDate: new Date('2021-03-15'),
                assignedTo: adminUser._id,
                category: 'training',
                estimatedHours: 16,
                checklist: [
                    { item: 'CRM system training', completed: false },
                    { item: 'Sales process overview', completed: false },
                    { item: 'Product knowledge session', completed: false },
                    { item: 'Shadow senior sales rep', completed: false }
                ]
            }
        ];

        for (const taskData of onboardingTasks) {
            const task = new OnboardingTask(taskData);
            await task.save();
        }

        console.log('Created onboarding tasks...');

        console.log('✅ Database seeded successfully!');
        console.log('\n📋 Sample Data Created:');
        console.log('- 2 Users (1 admin, 1 employee)');
        console.log('- 3 Employees');
        console.log('- 3 Candidates');
        console.log('- 4 Onboarding Tasks');
        console.log('\n🔑 Login Credentials:');
        console.log('Admin: admin@company.com / admin123');
        console.log('Employee: employee@company.com / employee123');

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

// Run seeding
connectDB().then(() => {
    seedData();
});
