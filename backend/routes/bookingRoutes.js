import { Router } from 'express';
import { getBookings, getBooking, createBooking, updateBooking, cancelBooking, deleteBooking } from '../controllers/bookingController.js';
const router = Router();
router.route('/').get(getBookings).post(createBooking);
router.patch('/:id/cancel', cancelBooking);
router.route('/:id').get(getBooking).put(updateBooking).delete(deleteBooking);
export default router;
