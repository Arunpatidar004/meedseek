import mongoose from 'mongoose';

const appoinmentSchema = new mongoose.Schema({
  doctor:{type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
  patient:{type: mongoose.Schema.Types.ObjectId, ref: 'Patient'}, 
  type:String,
  status:String,
  notes:String,
  date:String,
  time:String,
  reason:String,
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    respiratoryRate: Number,
    temperature: Number,
    spO2: Number
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Appoinments', appoinmentSchema);
