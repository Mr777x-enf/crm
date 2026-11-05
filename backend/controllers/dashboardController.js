import Customer from '../models/Customer.js';
import Interaction from '../models/Interaction.js';
import FollowUp from '../models/FollowUp.js';
import Booking from '../models/Booking.js';
import asyncHandler from '../utils/asyncHandler.js';

export default asyncHandler(async (req, res) => {
  const now = new Date();
  const [totalCustomers, totalInteractions, pendingFollowUps, completedFollowUps, overdueFollowUps,
    upcomingBookings, recentInteractions, upcomingFollowUps] = await Promise.all([
    Customer.countDocuments(),
    Interaction.countDocuments(),
    FollowUp.countDocuments({ status: 'Pending', scheduledAt: { $gte: now } }),
    FollowUp.countDocuments({ status: 'Completed' }),
    FollowUp.countDocuments({ status: 'Pending', scheduledAt: { $lt: now } }),
    Booking.countDocuments({ status: 'Confirmed', bookingDate: { $gte: now.toISOString().slice(0, 10) } }),
    Interaction.find().populate('customerId', 'name').sort({ interactionDate: -1 }).limit(6),
    FollowUp.find({ status: 'Pending', scheduledAt: { $gte: now } }).populate('customerId', 'name').sort({ scheduledAt: 1 }).limit(6)
  ]);
  res.json({ totalCustomers, totalInteractions, pendingFollowUps, completedFollowUps, overdueFollowUps, upcomingBookings, recentInteractions, upcomingFollowUps });
});
