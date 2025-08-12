import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  title: String,
  type: String,
  date: String,
  provider: String,
  facilityName: String,
  disease: String,
  description: String,
  diagnosis: String,
  treatment: String,
  files: [{
    id: String,
    name: String,
    filetype: String,
    size: Number, 
    encryption: {
      key: String,
      iv: String
    }
  }],
  tags: [String],
  starred: Boolean,
  aiSummary: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Record || mongoose.model('Record', recordSchema);
