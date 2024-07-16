import express from 'express';

import ResultController from '../controllers/results';

const router = express.Router();

router.route('/').post(ResultController.createResult);
router.route('/:id').delete(ResultController.deleteResult);

export default router;