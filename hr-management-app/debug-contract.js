const axios = require('axios');

const API_BASE = 'http://192.168.0.164:5000';
const ADMIN_EMAIL = 'admin@hr.com';
const ADMIN_PASSWORD = 'Admin123';

async function debugContract() {
  console.log('🔍 Debugging Contract Generation...');

  try {
    // 1. Test server connection
    console.log('\n1. Testing server connection...');
    try {
      const healthResponse = await axios.get(`${API_BASE}/`);
      console.log('✅ Server is running:', healthResponse.data);
    } catch (error) {
      console.log('❌ Server connection failed:', error.message);
      return;
    }

    // 2. Test login
    console.log('\n2. Testing login...');
    let token;
    try {
      const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });
      token = loginResponse.data.data.token;
      console.log('✅ Login successful');
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
      return;
    }

    // 3. Test contract templates endpoint
    console.log('\n3. Testing contract templates...');
    try {
      const templatesResponse = await axios.get(`${API_BASE}/api/contracts/templates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Templates endpoint works:', templatesResponse.data);
    } catch (error) {
      console.log('❌ Templates endpoint failed:', error.response?.data?.message || error.message);
    }

    // 4. Get employees
    console.log('\n4. Getting employees...');
    let employeeId;
    try {
      const employeesResponse = await axios.get(`${API_BASE}/api/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const employees = employeesResponse.data.data;
      console.log(`✅ Found ${employees.length} employees`);
      
      if (employees.length > 0) {
        employeeId = employees[0]._id;
        console.log(`Using employee: ${employees[0].name} (ID: ${employeeId})`);
      } else {
        console.log('❌ No employees found');
        return;
      }
    } catch (error) {
      console.log('❌ Get employees failed:', error.response?.data?.message || error.message);
      return;
    }

    // 5. Test contract generation with detailed error
    console.log('\n5. Testing contract generation...');
    try {
      const contractResponse = await axios.post(`${API_BASE}/api/contracts/generate`, {
        employeeId: employeeId,
        contractType: 'trial'
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob',
        timeout: 30000 // 30 seconds timeout
      });
      console.log('✅ Contract generated successfully!');
      console.log(`PDF size: ${contractResponse.data.length} bytes`);
    } catch (error) {
      console.log('❌ Contract generation failed:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message || error.message);
      console.log('Full error:', error.response?.data);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugContract();
