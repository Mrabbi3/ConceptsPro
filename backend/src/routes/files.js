const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');
const { upload, uploadDir, getFileUrl } = require('../services/fileService');

router.use(authenticate);

// Upload file
router.post('/upload/:folder?', upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = getFileUrl(req, req.file.path);

    res.json({
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });
  } catch (error) {
    next(error);
  }
});

// Upload multiple files
router.post('/upload/multiple/:folder?', upload.array('files', 10), (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = req.files.map((file) => ({
      fileName: file.originalname,
      fileUrl: getFileUrl(req, file.path),
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
    }));

    res.json({ files });
  } catch (error) {
    next(error);
  }
});

// Download/Serve file
router.get('/:folder/:filename', (req, res, next) => {
  try {
    const { folder, filename } = req.params;
    const filePath = path.join(uploadDir, folder, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.sendFile(path.resolve(filePath));
  } catch (error) {
    next(error);
  }
});

module.exports = router;

