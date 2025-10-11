// Simple test để check Vercel function có chạy được không
module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test API is working!',
    timestamp: new Date().toISOString()
  });
};

