const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// @desc    Generate contract PDF (Simple version)
// @route   POST /api/contracts/generate-simple
// @access  Private (HR and Admin only)
const generateContractSimple = async (req, res) => {
  try {
    const { employeeId, contractType } = req.body;
    
    if (!employeeId || !contractType) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID and contract type are required'
      });
    }

    // Get employee data
    const employee = await User.findById(employeeId).select('-password');
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Prepare data for template
    // Format contract type display
    let contractTypeDisplay = employee.contractType;
    
    // Debug log
    console.log('Contract Type:', employee.contractType);
    console.log('Contract Duration:', employee.contractDuration);
    
    if (employee.contractType === 'Có thời hạn' && employee.contractDuration) {
      contractTypeDisplay = `${employee.contractDuration} năm`;
    }
    
    console.log('Display:', contractTypeDisplay);
    
    const contractData = {
      employeeName: employee.name,
      cccd: employee.cccd,
      cccdIssueDate: employee.cccdIssueDate ? new Date(employee.cccdIssueDate).toLocaleDateString('vi-VN') : '',
      cccdIssuePlace: employee.cccdIssuePlace,
      phone: employee.phone,
      permanentAddress: employee.permanentAddress,
      position: employee.position,
      department: employee.department,
      educationLevel: employee.educationLevel,
      major: employee.major,
      school: employee.school,
      contractType: contractTypeDisplay,
      contractDuration: employee.contractDuration,
      startDate: employee.contractStartDate ? new Date(employee.contractStartDate).toLocaleDateString('vi-VN') : 'Chưa xác định',
      endDate: employee.contractEndDate ? new Date(employee.contractEndDate).toLocaleDateString('vi-VN') : 'Chưa xác định',
      salary: employee.salary ? employee.salary.toLocaleString() : '0',
      allowances: {
        meal: employee.allowances?.meal ? employee.allowances.meal.toLocaleString() : '0',
        transport: employee.allowances?.transport ? employee.allowances.transport.toLocaleString() : '0',
        additional: employee.allowances?.additional ? employee.allowances.additional.toLocaleString() : '0',
        hazardous: employee.allowances?.hazardous ? employee.allowances.hazardous.toLocaleString() : '0'
      },
      currentDate: new Date().toLocaleDateString('vi-VN'),
      contractNumber: Math.floor(Math.random() * 100) + 1, // Random contract number
      birthDate: employee.birthYear ? `01/01/${employee.birthYear}` : '',
      endDate: employee.officialDate ? new Date(new Date(employee.officialDate).getTime() + (2 * 365 * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN') : ''
    };

    // Calculate total salary
    const totalSalary = (employee.salary || 0) + 
                      (employee.allowances?.meal || 0) + 
                      (employee.allowances?.transport || 0) + 
                      (employee.allowances?.additional || 0) + 
                      (employee.allowances?.hazardous || 0);
    contractData.totalSalary = totalSalary.toLocaleString();

    // Create simple HTML content using the same template as PDF
    const templatePath = path.join(__dirname, '../templates/contract-official.html');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const handlebars = require('handlebars');
    const template = handlebars.compile(templateSource);
    const htmlContent = template(contractData);

    // Return HTML content for frontend to handle
    res.status(200).json({
      success: true,
      message: 'Contract HTML generated successfully',
      data: {
        html: htmlContent,
        employeeName: employee.name,
        contractType: contractType
      }
    });

  } catch (error) {
    console.error('Error generating simple contract:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating contract',
      error: error.message
    });
  }
};


module.exports = {
  generateContractSimple
};
