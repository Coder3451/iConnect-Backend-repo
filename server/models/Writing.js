import mongoose from 'mongoose';

const writingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, default: 'Untitled' },
    content: { type: mongoose.Schema.Types.Mixed, default: { blocks: [] } },
  },
  { timestamps: true }
);

writingSchema.index({ userId: 1, updatedAt: -1 });

export const Writing = mongoose.model('Writing', writingSchema);
