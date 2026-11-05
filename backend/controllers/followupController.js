import FollowUp from '../models/FollowUp.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ensureCustomer } from './common.js';

export const getFollowUps = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  res.json(await FollowUp.find(filter).populate('customerId', 'name').sort({ scheduledAt: 1 }));
});
export const getOverdue = asyncHandler(async (req, res) => {
  const items = await FollowUp.find({ status: 'Pending', scheduledAt: { $lt: new Date() } }).populate('customerId', 'name').sort({ scheduledAt: 1 });
  res.json(items);
});
export const createFollowUp = asyncHandler(async (req, res) => {
  await ensureCustomer(req.body.customerId);
  res.status(201).json(await (await FollowUp.create(req.body)).populate('customerId', 'name'));
});
export const updateFollowUp = asyncHandler(async (req, res) => {
  const item = await FollowUp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('customerId', 'name');
  if (!item) return res.status(404).json({ success: false, message: 'Follow-up not found.' });
  res.json(item);
});
export const setFollowUpStatus = asyncHandler(async (req, res) => {
  const item = await FollowUp.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }).populate('customerId', 'name');
  if (!item) return res.status(404).json({ success: false, message: 'Follow-up not found.' });
  res.json(item);
});
export const deleteFollowUp = asyncHandler(async (req, res) => {
  const item = await FollowUp.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Follow-up not found.' });
  res.json({ success: true });
});
