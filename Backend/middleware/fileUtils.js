const path = require('path');
const fs = require('fs');

// Secure file deletion utility
const secureDeleteFile = (filePath) => {
  try {
    // Resolve and normalize path
    const resolvedPath = path.resolve(__dirname, '..', filePath);
    const uploadsDir = path.resolve(__dirname, '../uploads');
    
    // Ensure the file is within the uploads directory
    if (!resolvedPath.startsWith(uploadsDir)) {
      throw new Error('Invalid file path');
    }
    
    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
      console.log('File deleted securely:', resolvedPath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

module.exports = { secureDeleteFile };