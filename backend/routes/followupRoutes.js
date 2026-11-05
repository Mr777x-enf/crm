import { Router } from 'express';
import { getFollowUps, getOverdue, createFollowUp, updateFollowUp, setFollowUpStatus, deleteFollowUp } from '../controllers/followupController.js';
const router = Router();
router.get('/overdue', getOverdue);
router.route('/').get(getFollowUps).post(createFollowUp);
router.route('/:id/status').patch(setFollowUpStatus);
router.route('/:id').put(updateFollowUp).delete(deleteFollowUp);
export default router;
