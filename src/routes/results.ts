import express from 'express';

import ResultController from '../controllers/results';

const router = express.Router();

router.route('/').post(ResultController.createResult);
router.route('/:id').delete(ResultController.deleteResult);
router.route('/:id').put(ResultController.updateResult);

export default router;