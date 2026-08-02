const multer = require('multer');
// Multer storage configuration - using memory storage
const storage = multer.memoryStorage();
 
// Multer upload configurations - captures file and form fields
const upload = multer({ storage }).fields([
    { name: 'file', maxCount: 1 },
    { name: 'file_type', maxCount: 1 }
]);
 
module.exports = { upload };