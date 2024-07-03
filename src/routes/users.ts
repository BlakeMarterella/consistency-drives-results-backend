import express from 'express';

import UsersController from '../controllers/users';

const router = express.Router();

router.route('/').post(UsersController.createUser);
router.route('/:id').delete(UsersController.deleteUser);

export default router;