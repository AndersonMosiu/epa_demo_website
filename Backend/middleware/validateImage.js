const fs = require('fs');

// Validate image file content (magic numbers)
const validateImageContent = (req, res, next) => {
  if (!req.file) return next();
  
  const allowedSignatures = [
    'ffd8ffe0', // JPEG
    '89504e47', // PNG
    '47494638', // GIF
    '52494646'  // WEBP
  ];
  
  try {
    const buffer = fs.readFileSync(req.file.path);
    const fileSignature = buffer.toString('hex', 0, 4);
    
    if (!allowedSignatures.includes(fileSignature)) {
      // Delete the malicious file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Invalid image file' });
    }
    
    next();
  } catch (error) {
    // Delete file if there's an error reading it
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ message: 'Error validating image file' });
  }
};

module.exports = validateImageContent;