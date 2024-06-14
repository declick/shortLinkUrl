// models/Role.js
import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

export default mongoose.model('Role', roleSchema);
