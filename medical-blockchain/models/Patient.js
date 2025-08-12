import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: String,
  profileImage: String,
  age: String,
  gender: String,
  email: String,
  medicalConditions: [String],
  allergies: [String],
  lastVisit: String,
  records:[{type: mongoose.Schema.Types.ObjectId, ref: 'Record'}],
  appoinments:[{type: mongoose.Schema.Types.ObjectId, ref: 'Appoinment'}],
  doctor:{type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Patient', patientSchema);
