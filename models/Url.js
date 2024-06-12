import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: [
    {
      timestamp: { type: Date, default: Date.now },
      ip: String,
      referer: String,
    },
  ],
});

export default mongoose.model('Url', urlSchema);
