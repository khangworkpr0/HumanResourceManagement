# HR Management System - Backend API

A comprehensive backend API for HR Management System built with Node.js, Express, and MongoDB.

## 🚀 Features

### Employee Information Management
- **Employee CRUD Operations**: Create, read, update, delete employee records
- **Advanced Search & Filtering**: Search by name, department, status with pagination
- **Employee Statistics**: Department breakdown, contract types, age demographics
- **Profile Management**: Personal information, work history, skills tracking
- **Document Management**: Profile pictures, document storage (URL-based)

### Recruitment & Onboarding
- **Candidate Management**: Track job applicants with CV scoring
- **Interview Process**: Schedule interviews, track status, add notes
- **CV Analysis**: Automated keyword-based CV scoring system
- **Onboarding Tasks**: Create and track employee onboarding progress
- **Task Management**: Assign tasks, set priorities, track completion

### Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin and employee roles
- **Password Security**: bcrypt encryption for passwords
- **Rate Limiting**: Prevent brute force attacks

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcrypt, helmet, cors
- **Validation**: Mongoose schema validation

## 📁 Project Structure

```
server/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── employeeController.js
│   ├── candidateController.js
│   └── onboardingController.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # Database models
│   ├── User.js
│   ├── Employee.js
│   ├── Candidate.js
│   └── OnboardingTask.js
├── routes/              # API routes
│   ├── auth.js
│   ├── employees.js
│   ├── candidates.js
│   └── onboarding.js
├── scripts/             # Utility scripts
│   └── seed.js
├── server.js            # Main application file
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install dependencies**:
```bash
cd server
npm install
```

2. **Environment Setup**:
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hrms
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

3. **Start the server**:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

4. **Seed the database** (optional):
```bash
npm run seed
```

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - Register new user (admin only)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password

### Employees (`/api/employees`)
- `GET /` - List employees (with pagination and search)
- `GET /:id` - Get employee by ID
- `POST /` - Create employee (admin only)
- `PUT /:id` - Update employee
- `DELETE /:id` - Delete employee (admin only)
- `GET /statistics` - Get employee statistics
- `GET /department/:department` - Get employees by department

### Candidates (`/api/candidates`)
- `GET /` - List candidates (with filters)
- `GET /:id` - Get candidate by ID
- `POST /` - Create candidate (admin only)
- `PUT /:id` - Update candidate
- `PUT /:id/status` - Update interview status
- `PUT /:id/interview` - Add interview record
- `DELETE /:id` - Delete candidate (admin only)
- `GET /statistics` - Get candidate statistics
- `GET /top` - Get top candidates by CV score

### Onboarding (`/api/onboarding`)
- `GET /` - List onboarding tasks
- `GET /:id` - Get task by ID
- `POST /` - Create task (admin only)
- `POST /bulk` - Create multiple tasks (admin only)
- `PUT /:id` - Update task
- `PUT /:id/status` - Update task status
- `PUT /:id/comment` - Add task comment
- `DELETE /:id` - Delete task (admin only)
- `GET /overdue` - Get overdue tasks
- `GET /statistics` - Get onboarding statistics

## 🔐 Authentication

All routes except `/api/auth/login` require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Models

### User Model
- Email, password (hashed), role (admin/employee)
- Profile information, last login tracking
- Account status management

### Employee Model
- Personal information (name, age, address, phone, email)
- Work details (department, position, contract)
- Skills, work history, documents
- Profile picture and emergency contacts

### Candidate Model
- Personal information and contact details
- CV URL, resume text, skills
- Interview status and history
- Automated CV scoring based on keywords

### OnboardingTask Model
- Task details (name, description, priority)
- Status tracking and due dates
- Comments, checklists, dependencies
- Email notifications (mock implementation)

## 🎯 Key Features

### CV Scoring System
Automatically scores candidate CVs based on:
- Keyword matching for relevant skills
- Experience level bonus
- Skills count bonus
- Position-specific keyword sets

### Role-based Access Control
- **Admin**: Full access to all endpoints
- **Employee**: Limited access to own data only
- **Public**: Only login endpoint accessible

### Advanced Querying
- Text search across multiple fields
- Pagination with configurable limits
- Sorting by multiple criteria
- Filtering by status, department, etc.

### Error Handling
- Comprehensive error middleware
- Validation error handling
- Database error management
- Authentication error responses

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Sample Data

The seed script creates:
- 2 users (1 admin, 1 employee)
- 3 employees with complete profiles
- 3 candidates with CV scores
- 4 onboarding tasks with different statuses

**Default Login Credentials**:
- Admin: `admin@company.com` / `admin123`
- Employee: `employee@company.com` / `employee123`

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: Token expiration time
- `NODE_ENV`: Environment (development/production)
- `CLIENT_URL`: Frontend URL for CORS

### Database Indexes
Optimized indexes for:
- Text search (employee names, candidate emails)
- Status filtering
- Date-based queries
- Unique constraints

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Use secure JWT secret
3. Configure MongoDB Atlas or production MongoDB
4. Enable CORS for production domain
5. Set up SSL certificates
6. Configure reverse proxy (nginx)

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Performance Optimizations

- Database indexing for frequent queries
- Pagination for large datasets
- Efficient aggregation pipelines
- Connection pooling
- Response compression
- Rate limiting

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## 📞 Support

For issues and questions:
- Check the API documentation
- Review error logs
- Verify environment configuration
- Ensure MongoDB connection

---

**Built with ❤️ for modern HR management**
