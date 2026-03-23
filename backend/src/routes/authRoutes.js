import express from 'express';
import protect from '../middleware/protect.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/logout', protect, authController.logout);
router.put('/update-pic', protect, authController.updatePic);
router.delete('/delete-account', protect, authController.deleteAccount);
router.get('/checkAuth', protect, authController.checkAuth);
router.get('/:id', protect, authController.getUserById);

export default router;