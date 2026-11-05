import mongoose from 'mongoose';
import Customer from '../models/Customer.js';

export async function ensureCustomer(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Invalid customer ID.');
    error.status = 400;
    throw error;
  }
  if (!(await Customer.exists({ _id: id }))) {
    const error = new Error('Customer not found.');
    error.status = 404;
    throw error;
  }
}
