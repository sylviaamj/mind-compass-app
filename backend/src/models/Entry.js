import mongoose from 'mongoose';


const entrySchema = new mongoose.Schema({
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  medicationTaken: {
    type: Boolean,
    required: true,
    default: false,
  },
  journalEntry: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});


entrySchema.index({ createdAt: 1 });

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;
