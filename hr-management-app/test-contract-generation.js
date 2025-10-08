const axios = require('axios');

const API_BASE = 'http://192.168.0.164:5000';
const ADMIN_EMAIL = 'admin@hr.com';
const ADMIN_PASSWORD = 'Admin123';

async function testContractGeneration() {
  console.log('📄 Testing Contract Generation Feature...');

  try {
    // 1. Login as admin
    console.log('\n1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful!');

    // 2. Get contract templates
    console.log('\n2. Getting contract templates...');
    const templatesResponse = await axios.get(`${API_BASE}/api/contracts/templates`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Templates retrieved:');
    templatesResponse.data.data.forEach(template => {
      console.log(`   - ${template.name}: ${template.description}`);
    });

    // 3. Get employees list
    console.log('\n3. Getting employees list...');
    const employeesResponse = await axios.get(`${API_BASE}/api/employees`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const employees = employeesResponse.data.data;
    console.log(`✅ Found ${employees.length} employees`);

    if (employees.length === 0) {
      console.log('❌ No employees found. Please create an employee first.');
      return;
    }

    // 4. Test contract generation for first employee
    const testEmployee = employees[0];
    console.log(`\n4. Testing contract generation for: ${testEmployee.name}`);

    // Test trial contract
    console.log('   Testing trial contract...');
    try {
      const trialResponse = await axios.post(`${API_BASE}/api/contracts/generate`, {
        employeeId: testEmployee._id,
        contractType: 'trial'
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      console.log('   ✅ Trial contract generated successfully!');
      console.log(`   PDF size: ${trialResponse.data.length} bytes`);
    } catch (error) {
      console.log('   ❌ Trial contract generation failed:', error.response?.data?.message || error.message);
    }

    // Test official contract
    console.log('   Testing official contract...');
    try {
      const officialResponse = await axios.post(`${API_BASE}/api/contracts/generate`, {
        employeeId: testEmployee._id,
        contractType: 'official'
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      console.log('   ✅ Official contract generated successfully!');
      console.log(`   PDF size: ${officialResponse.data.length} bytes`);
    } catch (error) {
      console.log('   ❌ Official contract generation failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Contract generation test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Open http://192.168.0.164:3000 in your browser');
    console.log('2. Login with admin credentials');
    console.log('3. Go to Employees page');
    console.log('4. Click "Sửa" on any employee');
    console.log('5. Click "📄 Tạo Hợp Đồng" button');
    console.log('6. Select contract type and generate PDF');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testContractGeneration();
