import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  email: String,
  name: String,
  phone: String,
  specialization: String,
  password: String,
  hospital: String,
  profileImage: String,
  yearsOfExperience: Number,
  patients:[{type: mongoose.Schema.Types.ObjectId, ref: 'Patient'}],
  schedule : [{
    Day : {
      type: String,
      enum:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    },
    Time:[{
      type: String
    }]
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Doctor', doctorSchema);
