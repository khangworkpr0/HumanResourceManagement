const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Thông tin cơ bản
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'employee'],
    default: 'employee'
  },
  
  // Thông tin cá nhân
  birthYear: {
    type: Number,
    required: true
  },
  cccd: {
    type: String,
    required: true,
    unique: true
  },
  cccdIssueDate: {
    type: Date,
    required: true
  },
  cccdIssuePlace: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  permanentAddress: {
    type: String,
    required: true
  },
  birthPlace: {
    type: String,
    required: true
  },
  socialInsuranceNumber: {
    type: String,
    default: null
  },
  healthInsuranceNumber: {
    type: String,
    default: null
  },
  
  // Thông tin công việc
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  educationLevel: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  officialDate: {
    type: Date,
    required: true
  },
  contractType: {
    type: String,
    required: true,
    enum: ['Thử việc', 'Có thời hạn', 'Không thời hạn', 'Theo mùa vụ', 'Theo công việc']
  },
  salary: {
    type: Number,
    required: true
  },
  allowances: {
    meal: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    additional: { type: Number, default: 0 },
    hazardous: { type: Number, default: 0 }
  },
  
  // Hồ sơ
  documents: {
    resume: { type: String, default: null },
    healthCertificate: { type: String, default: null },
    diploma: { type: String, default: null },
    professionalCertificate: { type: String, default: null },
    practiceScope: { type: String, default: null }
  },
  
  profileImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
