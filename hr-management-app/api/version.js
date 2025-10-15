/**
 * Version endpoint to verify deployment
 */
module.exports = (req, res) => {
  res.json({
    version: '1.0.1',
    lastUpdated: '2024-10-15 14:50',
    commit: 'cfe0dfa',
    fix: 'MongoDB buffering timeout fixed',
    bufferCommandsDisabled: true,
    timestamp: new Date().toISOString()
  });
};

