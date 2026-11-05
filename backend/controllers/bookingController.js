import Booking from '../models/Booking.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ensureCustomer } from './common.js';

function validateTimes(body) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(body.startTime) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.endTime)) {
    const error = new Error('Start and end time must be valid 24-hour times.'); error.status = 400; throw error;
  }
  if (body.startTime >= body.endTime) {
    const error = new Error('Start time must be earlier than end time.'); error.status = 400; throw error;
  }
}

async function checkConflict(body, excludedId) {
  validateTimes(body);
  const filter = { bookingDate: body.bookingDate, status: 'Confirmed', startTime: { $lt: body.endTime }, endTime: { $gt: body.startTime } };
  if (excludedId) filter._id = { $ne: excludedId };
  if (await Booking.exists(filter)) {
    const error = new Error('This time slot is already booked.'); error.status = 409; throw error;
  }
}

export const getBookings = asyncHandler(async (req, res) => {
  res.json(await Booking.find().populate('customerId', 'name').sort({ bookingDate: 1, startTime: 1 }));
});
export const getBooking = asyncHandler(async (req, res) => {
  const item = await Booking.findById(req.params.id).populate('customerId', 'name');
  if (!item) return res.status(404).json({ success: false, message: 'Booking not found.' });
  res.json(item);
});
export const createBooking = asyncHandler(async (req, res) => {
  await ensureCustomer(req.body.customerId);
  await checkConflict(req.body);
  res.status(201).json(await (await Booking.create(req.body)).populate('customerId', 'name'));
});
export const updateBooking = asyncHandler(async (req, res) => {
  await ensureCustomer(req.body.customerId);
  await checkConflict(req.body, req.params.id);
  const item = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('customerId', 'name');
  if (!item) return res.status(404).json({ success: false, message: 'Booking not found.' });
  res.json(item);
});
export const cancelBooking = asyncHandler(async (req, res) => {
  const item = await Booking.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true }).populate('customerId', 'name');
  if (!item) return res.status(404).json({ success: false, message: 'Booking not found.' });
  res.json(item);
});
export const deleteBooking = asyncHandler(async (req, res) => {
  const item = await Booking.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Booking not found.' });
  res.json({ success: true });
});
