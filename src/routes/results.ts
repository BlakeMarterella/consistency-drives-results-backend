import express from 'express';

import ResultController from '../controllers/results';

const router = express.Router();

router.route('/').post(ResultController.create);

export default router;