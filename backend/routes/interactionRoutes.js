import { Router } from 'express';
import { getInteractions, getInteraction, createInteraction, updateInteraction, deleteInteraction } from '../controllers/interactionController.js';
const router = Router();
router.route('/').get(getInteractions).post(createInteraction);
router.route('/:id').get(getInteraction).put(updateInteraction).delete(deleteInteraction);
export default router;
