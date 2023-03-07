const router = require('express').Router();
const userControllers = require('../controllers/userControllers');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router.post('/register', userControllers.register);
router.post('/activate', userControllers.activateEmail);
router.post('/login', userControllers.login);
router.post('/refresh_token', userControllers.getAccessToken);
router.post('/forget', userControllers.forgetPassword);
router.post('/reset', auth, userControllers.resetPassword);

router.get('/information', auth, userControllers.getUserInformation);
router.get('/admin', auth, authAdmin, userControllers.getUserAllInformation);
router.get('/logout', userControllers.logout);

router.patch('/update', auth, userControllers.updateUsers);
router.patch('/update_role/:id', auth, authAdmin, userControllers.updateUserRole);

router.delete('/delete/:id', auth, authAdmin, userControllers.deleteUser);

module.exports = router;