import Customer from '../models/Customer.js';
import Interaction from '../models/Interaction.js';
import FollowUp from '../models/FollowUp.js';
import Booking from '../models/Booking.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCustomers = asyncHandler(async (req, res) => {
  const search = req.query.search?.trim();
  const filter = search ? { $or: [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { phone: { $regex: search, $options: 'i' } }
  ] } : {};
  res.json(await Customer.find(filter).sort({ createdAt: -1 }));
});

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
  const [interactions, followUps, bookings] = await Promise.all([
    Interaction.find({ customerId: customer._id }).sort({ interactionDate: -1 }),
    FollowUp.find({ customerId: customer._id }).sort({ scheduledAt: 1 }),
    Booking.find({ customerId: customer._id }).sort({ bookingDate: 1, startTime: 1 })
  ]);
  res.json({ customer, interactions, followUps, bookings });
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
});

export const updateCustomer = asyncHandler(async (req, res) => {
  if (req.body.consent) req.body.consent.updatedAt = new Date();
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
  res.json(customer);
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
  await Promise.all([
    Interaction.deleteMany({ customerId: customer._id }),
    FollowUp.deleteMany({ customerId: customer._id }),
    Booking.deleteMany({ customerId: customer._id })
  ]);
  res.json({ success: true, message: 'Customer deleted.' });
});
