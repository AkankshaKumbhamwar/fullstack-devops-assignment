import { Router } from 'express';
import { register, login, getData } from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', authMiddleware, getData);

export default router;