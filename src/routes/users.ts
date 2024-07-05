import express from 'express';

import UsersController from '../controllers/users';

const router = express.Router();

router.route('/').get(UsersController.listUsers);
router.route('/').post(UsersController.createUser);
router.route('/:id').delete(UsersController.deleteUser);
router.route('/:id').put(UsersController.updateUser);

export default router;