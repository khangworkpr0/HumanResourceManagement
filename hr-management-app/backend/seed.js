const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Define schemas
const employeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true, index: true },
    age: { type: Number, required: true, min: 18, max: 70 },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contract: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        type: { type: String, enum: ['full-time', 'part-time'], required: true }
    },
    department: { type: String, required: true, index: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    workHistory: [{
        company: String,
        position: String,
        duration: String,
        description: String
    }],
    profilePicture: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    cvUrl: { type: String, required: true },
    interviewStatus: { 
        type: String, 
        enum: ['applied', 'interviewed', 'offered', 'rejected', 'withdrawn'], 
        default: 'applied',
        index: true
    },
    position: { type: String, required: true },
    experience: { type: String, required: true },
    skills: [String],
    interviewDate: { type: Date, default: null },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const onboardingTaskSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'in-progress', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    assignedTo: { type: String, required: true },
    completedDate: { type: Date, default: null },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee'], required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create models
const Employee = mongoose.model('Employee', employeeSchema);
const Candidate = mongoose.model('Candidate', candidateSchema);
const OnboardingTask = mongoose.model('OnboardingTask', onboardingTaskSchema);
const User = mongoose.model('User', userSchema);

// Sample data
const sampleEmployees = [
    {
        fullName: "John Smith",
        age: 28,
        address: "123 Main St, New York, NY 10001",
        phone: "+1-555-0101",
        email: "john.smith@company.com",
        contract: {
            startDate: new Date('2022-06-15'),
            endDate: new Date('2025-06-15'),
            type: "full-time"
        },
        department: "Engineering",
        position: "Senior Developer",
        salary: 95000,
        workHistory: [
            {
                company: "Tech Corp",
                position: "Junior Developer",
                duration: "2020-2022",
                description: "Developed web applications using React and Node.js"
            }
        ],
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        status: "active"
    },
    {
        fullName: "Sarah Johnson",
        age: 32,
        address: "456 Oak Ave, Los Angeles, CA 90210",
        phone: "+1-555-0102",
        email: "sarah.johnson@company.com",
        contract: {
            startDate: new Date('2021-03-10'),
            endDate: new Date('2024-03-10'),
            type: "full-time"
        },
        department: "Human Resources",
        position: "HR Manager",
        salary: 78000,
        workHistory: [
            {
                company: "HR Solutions Inc",
                position: "HR Specialist",
                duration: "2018-2021",
                description: "Managed employee relations and recruitment processes"
            }
        ],
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        status: "active"
    },
    {
        fullName: "Michael Brown",
        age: 45,
        address: "789 Pine St, Chicago, IL 60601",
        phone: "+1-555-0103",
        email: "michael.brown@company.com",
        contract: {
            startDate: new Date('2020-01-15'),
            endDate: new Date('2026-01-15'),
            type: "full-time"
        },
        department: "Finance",
        position: "Finance Director",
        salary: 120000,
        workHistory: [
            {
                company: "Finance Global",
                position: "Senior Accountant",
                duration: "2015-2020",
                description: "Managed financial reporting and budgeting processes"
            },
            {
                company: "Accounting Plus",
                position: "Accountant",
                duration: "2010-2015",
                description: "Handled general ledger and financial analysis"
            }
        ],
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        status: "active"
    },
    {
        fullName: "Emily Davis",
        age: 26,
        address: "321 Elm St, Miami, FL 33101",
        phone: "+1-555-0104",
        email: "emily.davis@company.com",
        contract: {
            startDate: new Date('2023-02-20'),
            endDate: new Date('2025-02-20'),
            type: "part-time"
        },
        department: "Marketing",
        position: "Marketing Specialist",
        salary: 55000,
        workHistory: [
            {
                company: "Digital Marketing Co",
                position: "Marketing Intern",
                duration: "2022-2023",
                description: "Assisted with social media campaigns and content creation"
            }
        ],
        profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        status: "active"
    },
    {
        fullName: "David Wilson",
        age: 38,
        address: "654 Maple Dr, Seattle, WA 98101",
        phone: "+1-555-0105",
        email: "david.wilson@company.com",
        contract: {
            startDate: new Date('2021-09-05'),
            endDate: new Date('2024-09-05'),
            type: "full-time"
        },
        department: "Operations",
        position: "Operations Manager",
        salary: 88000,
        workHistory: [
            {
                company: "Operations Pro",
                position: "Operations Coordinator",
                duration: "2018-2021",
                description: "Managed daily operations and process improvements"
            },
            {
                company: "Business Solutions",
                position: "Operations Assistant",
                duration: "2015-2018",
                description: "Supported operational activities and reporting"
            }
        ],
        profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        status: "active"
    },
    {
        fullName: "Lisa Anderson",
        age: 29,
        address: "987 Cedar Ln, Austin, TX 78701",
        phone: "+1-555-0106",
        email: "lisa.anderson@company.com",
        contract: {
            startDate: new Date('2022-11-12'),
            endDate: new Date('2025-11-12'),
            type: "full-time"
        },
        department: "Sales",
        position: "Sales Representative",
        salary: 65000,
        workHistory: [
            {
                company: "Sales Dynamics",
                position: "Junior Sales Rep",
                duration: "2020-2022",
                description: "Generated leads and maintained client relationships"
            }
        ],
        profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        status: "active"
    },
    {
        fullName: "Robert Taylor",
        age: 42,
        address: "147 Birch St, Denver, CO 80201",
        phone: "+1-555-0107",
        email: "robert.taylor@company.com",
        contract: {
            startDate: new Date('2019-07-08'),
            endDate: new Date('2025-07-08'),
            type: "full-time"
        },
        department: "IT",
        position: "IT Manager",
        salary: 105000,
        workHistory: [
            {
                company: "Tech Solutions Ltd",
                position: "Senior IT Specialist",
                duration: "2016-2019",
                description: "Managed IT infrastructure and security systems"
            },
            {
                company: "Computer Systems Inc",
                position: "IT Support",
                duration: "2012-2016",
                description: "Provided technical support and system maintenance"
            }
        ],
        profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        status: "active"
    },
    {
        fullName: "Jennifer Martinez",
        age: 31,
        address: "258 Spruce Ave, Phoenix, AZ 85001",
        phone: "+1-555-0108",
        email: "jennifer.martinez@company.com",
        contract: {
            startDate: new Date('2023-01-30'),
            endDate: new Date('2026-01-30'),
            type: "full-time"
        },
        department: "Customer Support",
        position: "Customer Support Manager",
        salary: 72000,
        workHistory: [
            {
                company: "Support Solutions",
                position: "Customer Support Rep",
                duration: "2020-2023",
                description: "Handled customer inquiries and resolved technical issues"
            }
        ],
        profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        status: "active"
    },
    {
        fullName: "Kevin Thompson",
        age: 27,
        address: "369 Willow Rd, Portland, OR 97201",
        phone: "+1-555-0109",
        email: "kevin.thompson@company.com",
        contract: {
            startDate: new Date('2022-08-15'),
            endDate: new Date('2024-08-15'),
            type: "part-time"
        },
        department: "Product Management",
        position: "Product Analyst",
        salary: 68000,
        workHistory: [
            {
                company: "Product Innovations",
                position: "Junior Product Analyst",
                duration: "2021-2022",
                description: "Analyzed product performance and user feedback"
            }
        ],
        profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        status: "active"
    },
    {
        fullName: "Amanda Garcia",
        age: 35,
        address: "741 Poplar St, Nashville, TN 37201",
        phone: "+1-555-0110",
        email: "amanda.garcia@company.com",
        contract: {
            startDate: new Date('2020-12-01'),
            endDate: new Date('2026-12-01'),
            type: "full-time"
        },
        department: "Legal",
        position: "Legal Counsel",
        salary: 110000,
        workHistory: [
            {
                company: "Legal Associates",
                position: "Associate Lawyer",
                duration: "2018-2020",
                description: "Handled corporate legal matters and contracts"
            },
            {
                company: "Law Firm Partners",
                position: "Junior Associate",
                duration: "2016-2018",
                description: "Assisted with legal research and case preparation"
            }
        ],
        profilePicture: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        status: "active"
    }
];

const sampleCandidates = [
    {
        name: "Alex Chen",
        email: "alex.chen@email.com",
        phone: "+1-555-0201",
        cvUrl: "https://example.com/cv/alex-chen.pdf",
        interviewStatus: "applied",
        position: "Frontend Developer",
        experience: "3 years",
        skills: ["React", "JavaScript", "CSS", "HTML"],
        notes: "Strong portfolio with modern web applications"
    },
    {
        name: "Maria Rodriguez",
        email: "maria.rodriguez@email.com",
        phone: "+1-555-0202",
        cvUrl: "https://example.com/cv/maria-rodriguez.pdf",
        interviewStatus: "interviewed",
        position: "UX Designer",
        experience: "4 years",
        skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
        interviewDate: new Date('2024-01-15'),
        notes: "Excellent design skills and user-centered approach"
    },
    {
        name: "James Wilson",
        email: "james.wilson@email.com",
        phone: "+1-555-0203",
        cvUrl: "https://example.com/cv/james-wilson.pdf",
        interviewStatus: "offered",
        position: "Backend Developer",
        experience: "5 years",
        skills: ["Node.js", "Python", "MongoDB", "AWS"],
        interviewDate: new Date('2024-01-10'),
        notes: "Strong technical skills, ready to make offer"
    },
    {
        name: "Sophie Lee",
        email: "sophie.lee@email.com",
        phone: "+1-555-0204",
        cvUrl: "https://example.com/cv/sophie-lee.pdf",
        interviewStatus: "rejected",
        position: "Data Analyst",
        experience: "2 years",
        skills: ["SQL", "Python", "Tableau", "Excel"],
        interviewDate: new Date('2024-01-08'),
        notes: "Good skills but lacks experience with our specific tools"
    },
    {
        name: "Daniel Kim",
        email: "daniel.kim@email.com",
        phone: "+1-555-0205",
        cvUrl: "https://example.com/cv/daniel-kim.pdf",
        interviewStatus: "applied",
        position: "DevOps Engineer",
        experience: "4 years",
        skills: ["Docker", "Kubernetes", "Jenkins", "Linux"],
        notes: "Strong infrastructure and automation experience"
    }
];

// Connect to MongoDB
async function connectDB() {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hrdb';
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
}

// Create indexes
async function createIndexes() {
    try {
        console.log('📊 Creating database indexes...');
        
        // Employee indexes
        await Employee.collection.createIndex({ fullName: 1 }, { name: 'fullName_1' });
        await Employee.collection.createIndex({ department: 1 }, { name: 'department_1' });
        await Employee.collection.createIndex({ status: 1 }, { name: 'status_1' });
        
        // Candidate indexes
        await Candidate.collection.createIndex({ email: 1 }, { name: 'candidate_email_1' });
        await Candidate.collection.createIndex({ interviewStatus: 1 }, { name: 'interviewStatus_1' });
        
        // OnboardingTask indexes
        await OnboardingTask.collection.createIndex({ employeeId: 1 }, { name: 'employeeId_1' });
        
        // User indexes (email is already unique from schema)
        console.log('✅ All indexes created successfully');
    } catch (error) {
        if (error.message.includes('existing index')) {
            console.log('⚠️ Some indexes already exist, continuing...');
        } else {
            console.error('❌ Error creating indexes:', error.message);
            throw error;
        }
    }
}

// Clear existing data
async function clearData() {
    try {
        console.log('🗑️ Clearing existing data...');
        await Employee.deleteMany({});
        await Candidate.deleteMany({});
        await OnboardingTask.deleteMany({});
        await User.deleteMany({});
        console.log('✅ Existing data cleared');
    } catch (error) {
        console.error('❌ Error clearing data:', error.message);
        throw error;
    }
}

// Seed employees
async function seedEmployees() {
    try {
        console.log('👥 Seeding employees...');
        const employees = await Employee.insertMany(sampleEmployees);
        console.log(`✅ ${employees.length} employees seeded successfully`);
        return employees;
    } catch (error) {
        console.error('❌ Error seeding employees:', error.message);
        throw error;
    }
}

// Seed candidates
async function seedCandidates() {
    try {
        console.log('📋 Seeding candidates...');
        const candidates = await Candidate.insertMany(sampleCandidates);
        console.log(`✅ ${candidates.length} candidates seeded successfully`);
        return candidates;
    } catch (error) {
        console.error('❌ Error seeding candidates:', error.message);
        throw error;
    }
}

// Seed users
async function seedUsers(employees) {
    try {
        console.log('👤 Seeding users...');
        
        // Hash passwords
        const adminPassword = await bcrypt.hash('Admin123', 12);
        const employeePassword = await bcrypt.hash('Employee123', 12);
        
        const users = [
            {
                name: "HR Admin",
                email: "admin@hr.com",
                password: adminPassword,
                role: "admin",
                employeeId: null
            },
            {
                name: employees[0].fullName,
                email: employees[0].email,
                password: employeePassword,
                role: "employee",
                employeeId: employees[0]._id
            },
            {
                name: employees[1].fullName,
                email: employees[1].email,
                password: employeePassword,
                role: "employee",
                employeeId: employees[1]._id
            }
        ];
        
        const seededUsers = await User.insertMany(users);
        console.log(`✅ ${seededUsers.length} users seeded successfully`);
        return seededUsers;
    } catch (error) {
        console.error('❌ Error seeding users:', error.message);
        throw error;
    }
}

// Seed onboarding tasks
async function seedOnboardingTasks(employees) {
    try {
        console.log('✅ Seeding onboarding tasks...');
        
        const onboardingTasks = [
            {
                employeeId: employees[0]._id,
                title: "Setup Email Account",
                description: "Create company email account and configure access",
                category: "IT Setup",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                status: "pending",
                assignedTo: "IT Team",
                notes: "Standard email setup for new employees"
            },
            {
                employeeId: employees[0]._id,
                title: "Complete HR Training",
                description: "Complete mandatory HR training modules",
                category: "Training",
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                status: "pending",
                assignedTo: "HR Team",
                notes: "Includes company policies and procedures"
            },
            {
                employeeId: employees[1]._id,
                title: "Setup Workstation",
                description: "Configure laptop, phone, and workspace",
                category: "IT Setup",
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                status: "completed",
                assignedTo: "IT Team",
                completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                notes: "Workstation setup completed successfully"
            },
            {
                employeeId: employees[2]._id,
                title: "Security Clearance",
                description: "Complete background check and security clearance",
                category: "Security",
                dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
                status: "in-progress",
                assignedTo: "Security Team",
                notes: "Background check in progress"
            },
            {
                employeeId: employees[3]._id,
                title: "Department Orientation",
                description: "Meet with department head and team members",
                category: "Orientation",
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                status: "pending",
                assignedTo: "Department Manager",
                notes: "Introduction to team and department processes"
            }
        ];
        
        const seededTasks = await OnboardingTask.insertMany(onboardingTasks);
        console.log(`✅ ${seededTasks.length} onboarding tasks seeded successfully`);
        return seededTasks;
    } catch (error) {
        console.error('❌ Error seeding onboarding tasks:', error.message);
        throw error;
    }
}

// Main seed function
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding process...');
        
        // Connect to database
        await connectDB();
        
        // Create indexes
        await createIndexes();
        
        // Clear existing data
        await clearData();
        
        // Seed data
        const employees = await seedEmployees();
        const candidates = await seedCandidates();
        const users = await seedUsers(employees);
        const onboardingTasks = await seedOnboardingTasks(employees);
        
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('📊 Summary:');
        console.log(`   - ${employees.length} employees`);
        console.log(`   - ${candidates.length} candidates`);
        console.log(`   - ${users.length} users`);
        console.log(`   - ${onboardingTasks.length} onboarding tasks`);
        console.log('\n🔑 Login credentials:');
        console.log('   Admin: admin@hr.com / Admin123');
        console.log('   Employee: john.smith@company.com / Employee123');
        console.log('   Employee: sarah.johnson@company.com / Employee123');
        
    } catch (error) {
        console.error('❌ Database seeding failed:', error.message);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the seed script
if (require.main === module) {
    seedDatabase();
}

module.exports = {
    seedDatabase,
    Employee,
    Candidate,
    OnboardingTask,
    User
};
