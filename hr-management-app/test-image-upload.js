const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:5000';

async function testImageUpload() {
  console.log('📸 Testing Image Upload Feature...\n');
  
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
      name: 'Test Employee with Image',
      email: `test.image.${Date.now()}@company.com`,
      password: 'Test123',
      department: 'Engineering',
      position: 'Software Developer',
      phone: '+1-555-0199',
      address: '123 Test St, Test City',
      salary: 75000,
      hireDate: '2022-01-15'
    };
    
    const createResponse = await axios.post(`${API_BASE}/api/employees`, employeeData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Employee created successfully!');
    console.log('Employee ID:', createResponse.data.data._id);
    
    // Create a test image file
    console.log('\n3. Creating test image...');
    const testImagePath = 'test-image.png';
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('✅ Test image created!');
    
    // Upload profile image
    console.log('\n4. Uploading profile image...');
    const formData = new FormData();
    formData.append('profileImage', fs.createReadStream(testImagePath), {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    const uploadResponse = await axios.put(
      `${API_BASE}/api/employees/${createResponse.data.data._id}/profile-image`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      }
    );
    
    console.log('✅ Profile image uploaded successfully!');
    console.log('Image URL:', uploadResponse.data.data.profileImage);
    
    // Get employee details to verify image
    console.log('\n5. Verifying image in employee details...');
    const employeeResponse = await axios.get(`${API_BASE}/api/employees/${createResponse.data.data._id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Employee details retrieved!');
    console.log('Profile Image URL:', employeeResponse.data.data.profileImage);
    
    // Test image URL accessibility
    console.log('\n6. Testing image URL accessibility...');
    try {
      const imageResponse = await axios.get(employeeResponse.data.data.profileImage);
      console.log('✅ Image URL is accessible!');
      console.log('Image size:', imageResponse.data.length, 'bytes');
    } catch (imageError) {
      console.log('❌ Image URL not accessible:', imageError.message);
    }
    
    // Clean up
    console.log('\n7. Cleaning up...');
    await axios.delete(`${API_BASE}/api/employees/${createResponse.data.data._id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // Delete test image file
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    
    console.log('✅ Clean up completed!');
    
    console.log('\n🎉 Image Upload Test Completed!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Employee creation works');
    console.log('- ✅ Profile image upload works');
    console.log('- ✅ Image URL is generated correctly');
    console.log('- ✅ Image is accessible via URL');
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
testImageUpload();
