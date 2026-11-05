import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('FollowUp', followUpSchema);
