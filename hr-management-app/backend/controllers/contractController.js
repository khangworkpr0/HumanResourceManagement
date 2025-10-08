const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const User = require('../models/User');

// @desc    Generate contract PDF
// @route   POST /api/contracts/generate
// @access  Private (HR and Admin only)
const generateContract = async (req, res) => {
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

    // Select template based on contract type
    let templatePath;
    switch (contractType) {
      case 'trial':
        templatePath = path.join(__dirname, '../templates/contract-trial.html');
        break;
      case 'official':
        templatePath = path.join(__dirname, '../templates/contract-official.html');
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid contract type'
        });
    }

    // Read and compile template
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    const html = template(contractData);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });

    await browser.close();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="hop-dong-${contractType}-${employee.name.replace(/\s+/g, '-')}.pdf"`);
    res.setHeader('Content-Length', pdf.length);

    res.send(pdf);

  } catch (error) {
    console.error('Error generating contract:', error);
    
    // Close browser if it exists
    try {
      if (browser) {
        await browser.close();
      }
    } catch (closeError) {
      console.error('Error closing browser:', closeError);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error generating contract',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get contract templates
// @route   GET /api/contracts/templates
// @access  Private (HR and Admin only)
const getContractTemplates = async (req, res) => {
  try {
    const templates = [
      {
        id: 'trial',
        name: 'Hợp Đồng Thử Việc',
        description: 'Hợp đồng thử việc 2 tháng',
        duration: '2 tháng'
      },
      {
        id: 'official',
        name: 'Hợp Đồng Lao Động Chính Thức',
        description: 'Hợp đồng lao động chính thức',
        duration: 'Theo loại hợp đồng'
      }
    ];

    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting templates',
      error: error.message
    });
  }
};

module.exports = {
  generateContract,
  getContractTemplates
};
