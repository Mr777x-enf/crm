import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, enum: ['Call', 'Email', 'Meeting', 'Visit', 'Other'], required: true },
  notes: { type: String, required: true, trim: true },
  interactionDate: { type: Date, required: true, default: Date.now },
  staffName: { type: String, default: '', trim: true },
  nextAction: { type: String, default: '', trim: true }
}, { timestamps: true });

export default mongoose.model('Interaction', interactionSchema);
