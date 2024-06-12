import express from 'express';
import 'express-async-errors';

import authRoutes from './auth';
import usersRoutes from './users';
import resultRoutes from './result';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/result', resultRoutes);

router.route('/health').get((req, res) => res.send('Server is up!'));

export default router;