import express from 'express';
import { getInfoUser, Register, Login, Logout, ResetKodeAkses } from '../controllers/Users.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';
import { cekNomerRekening, NorekBanklain, Transfer } from '../controllers/Transfer.js';

const router = express.Router(); // router dari express

router.get('/users', verifyToken, getInfoUser);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.post('/gantikode', ResetKodeAkses);
router.post('/transfer', verifyToken, Transfer);
router.post('/ceknomor', cekNomerRekening);
router.post('/daftarbanklain', verifyToken, NorekBanklain);

export default router;
