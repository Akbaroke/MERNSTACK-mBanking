import express from 'express';
import { getInfoUser, Register, Login, Logout, Transfer, ResetKodeAkses } from '../controllers/Users.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';

const router = express.Router(); // router dari express

router.get('/users', verifyToken, getInfoUser);
router.post('/transfer', verifyToken, Transfer);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.post('/gantikode', ResetKodeAkses);

export default router;
