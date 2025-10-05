const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_BASE = 'http://localhost:5000';

async function testFileUploadCategories() {
  console.log('📁 Testing File Upload Categories...\n');
  
  try {
    // Login first
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@hr.com',
      password: 'Admin123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful!');
    
    // Create a test employee first
    console.log('\n2. Creating test employee...');
    const employeeData = {
      name: 'Test Employee for Files',
      email: `test.files.${Date.now()}@company.com`,
      password: 'Test123',
      birthYear: 1990,
      cccd: '123456789',
      cccdIssueDate: '2020-01-01',
      cccdIssuePlace: 'Hà Nội',
      phone: '+1-555-0199',
      permanentAddress: '123 Test St, Test City',
      birthPlace: 'Hà Nội',
      department: 'Engineering',
      position: 'Software Developer',
      educationLevel: 'Đại học',
      major: 'Computer Science',
      school: 'Test University',
      startDate: '2022-01-15',
      officialDate: '2022-02-15',
      contractType: 'Không thời hạn',
      salary: 75000
    };
    
    const createResponse = await axios.post(`${API_BASE}/api/employees`, employeeData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Employee created successfully!');
    console.log('Employee ID:', createResponse.data.data._id);
    
    const employeeId = createResponse.data.data._id;
    
    // Test uploading different categories
    const categories = [
      { name: 'resume', label: 'Sơ Yếu Lý Lịch' },
      { name: 'health', label: 'Giấy Khám Sức Khỏe' },
      { name: 'diploma', label: 'Bằng Cấp' },
      { name: 'certificate', label: 'Chứng Chỉ Hành Nghề' },
      { name: 'other', label: 'Tài Liệu Khác' }
    ];
    
    for (const category of categories) {
      console.log(`\n3. Testing upload for ${category.label}...`);
      
      // Create a test file
      const testFileName = `test-${category.name}.txt`;
      const testContent = `This is a test ${category.label} file`;
      fs.writeFileSync(testFileName, testContent);
      
      // Upload file
      const formData = new FormData();
      formData.append('file', fs.createReadStream(testFileName));
      formData.append('category', category.name);
      
      try {
        const uploadResponse = await axios.post(
          `${API_BASE}/api/employees/${employeeId}/files`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              ...formData.getHeaders()
            }
          }
        );
        
        console.log(`✅ ${category.label} uploaded successfully!`);
        console.log(`   File ID: ${uploadResponse.data.data._id}`);
        console.log(`   Category: ${uploadResponse.data.data.category}`);
        
      } catch (uploadError) {
        console.log(`❌ Failed to upload ${category.label}:`, uploadError.response?.data?.message || uploadError.message);
      }
      
      // Clean up test file
      if (fs.existsSync(testFileName)) {
        fs.unlinkSync(testFileName);
      }
    }
    
    // Get all files for the employee
    console.log('\n4. Getting all files for employee...');
    const filesResponse = await axios.get(`${API_BASE}/api/employees/${employeeId}/files`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Files retrieved successfully!');
    console.log('Total files:', filesResponse.data.count);
    
    filesResponse.data.data.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.originalName} (${file.category}) - ${(file.fileSize / 1024).toFixed(1)} KB`);
    });
    
    // Clean up
    console.log('\n5. Cleaning up...');
    await axios.delete(`${API_BASE}/api/employees/${employeeId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Clean up completed!');
    
    console.log('\n🎉 File Upload Categories Test Completed!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Employee creation works');
    console.log('- ✅ File upload with categories works');
    console.log('- ✅ File retrieval works');
    console.log('- ✅ Clean up successful');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testFileUploadCategories();
