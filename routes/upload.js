const router = require('express').Router();
const uploadAvatar = require('../middleware/uploadAvatar');
const uploadController = require('../controllers/uploadAvatarControllers');
const auth = require('../middleware/auth');

router.post('/upload_avatar', uploadAvatar, auth, uploadController.uploadAvatar)

module.exports = router;