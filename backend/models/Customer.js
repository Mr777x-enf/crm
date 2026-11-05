import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, default: '', trim: true },
  consent: {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    phoneCall: { type: Boolean, default: false },
    preferredMethod: { type: String, enum: ['Email', 'SMS', 'Phone'], default: 'Phone' },
    updatedAt: { type: Date, default: Date.now }
  }
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
