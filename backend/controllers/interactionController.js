import Interaction from '../models/Interaction.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ensureCustomer } from './common.js';

export const getInteractions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.customerId) filter.customerId = req.query.customerId;
  const interactions = await Interaction.find(filter).populate('customerId', 'name email').sort({ interactionDate: -1 });
  res.json(interactions);
});
export const getInteraction = asyncHandler(async (req, res) => {
  const item = await Interaction.findById(req.params.id).populate('customerId', 'name email');
  if (!item) return res.status(404).json({ success: false, message: 'Interaction not found.' });
  res.json(item);
});
export const createInteraction = asyncHandler(async (req, res) => {
  await ensureCustomer(req.body.customerId);
  const item = await Interaction.create(req.body);
  res.status(201).json(await item.populate('customerId', 'name email'));
});
export const updateInteraction = asyncHandler(async (req, res) => {
  const item = await Interaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('customerId', 'name email');
  if (!item) return res.status(404).json({ success: false, message: 'Interaction not found.' });
  res.json(item);
});
export const deleteInteraction = asyncHandler(async (req, res) => {
  const item = await Interaction.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Interaction not found.' });
  res.json({ success: true });
});
