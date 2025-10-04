# HR Management System

A full-stack HR Management System built with React.js, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Login/Register with JWT tokens
- **Role-based Access Control**: Admin and Employee roles
- **Employee Information Management**: Complete employee profiles with contracts, work history, and status tracking
- **Candidate Management**: Track job candidates through recruitment process
- **Onboarding Tasks**: Manage new employee onboarding workflows
- **Modern UI**: Glass morphism design with animations and responsive layout
- **Real-time Updates**: Dynamic data updates with optimized performance

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for validation

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Context API for state management

## Project Structure

```
hr-management-app/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── config.env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hr-management-app
```

2. Install dependencies for both frontend and backend
```bash
npm run install-all
```

3. Set up environment variables
```bash
# Copy the example environment file
cp backend/config.env.example backend/config.env

# Edit backend/config.env with your configuration
```

4. Start MongoDB service
```bash
# For local MongoDB installation
mongod

# Or use MongoDB Atlas cloud service
```

5. Seed the database with sample data
```bash
# Navigate to backend directory
cd backend

# Run the seed script
node seed.js

# This will create sample employees, candidates, users, and onboarding tasks
```

6. Run the development servers
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
# Backend only: npm run server
# Frontend only: npm run client
```

### Environment Variables

Create a `config.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/hrdb
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

## Database Schema

### Collections Created by Seed Script

#### Employees Collection
- **Indexes**: fullName, department, status
- **Fields**: fullName, age, address, phone, email, contract, department, position, salary, workHistory, profilePicture, status

#### Candidates Collection  
- **Indexes**: email, interviewStatus
- **Fields**: name, email, phone, cvUrl, interviewStatus, position, experience, skills, interviewDate, notes

#### Onboarding Tasks Collection
- **Indexes**: employeeId
- **Fields**: employeeId, title, description, category, dueDate, status, assignedTo, completedDate, notes

#### Users Collection
- **Indexes**: email
- **Fields**: name, email, password (hashed), role, employeeId, isActive, lastLogin

## Sample Data

The seed script creates:
- **10 employees** with realistic data including contracts, work history, and profile pictures
- **5 candidates** in different interview stages (applied, interviewed, offered, rejected)
- **3 users**: 1 admin and 2 employees linked to employee records
- **5 onboarding tasks** with various statuses and categories

## Login Credentials (After Seeding)

- **Admin**: admin@hr.com / Admin123
- **Employee**: john.smith@company.com / Employee123  
- **Employee**: sarah.johnson@company.com / Employee123

## User Roles

1. **Admin**: Full access to all features including employee management, candidate tracking, and onboarding tasks
2. **Employee**: Access to own profile and basic information

## Running the Seed Script

The seed script (`backend/seed.js`) provides comprehensive database setup:

```bash
# Navigate to backend directory
cd backend

# Run the seed script
node seed.js
```

### What the Seed Script Does:
1. **Connects to MongoDB** using environment variables
2. **Creates indexes** for optimal query performance
3. **Clears existing data** to ensure clean setup
4. **Seeds sample data** for all collections
5. **Provides login credentials** for testing

### Error Handling:
- Duplicate entry prevention
- Connection error handling
- Graceful failure with detailed error messages
- Automatic database connection cleanup

## Production Deployment

1. Build the frontend
```bash
npm run build
```

2. Set production environment variables
3. Start the production server
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
