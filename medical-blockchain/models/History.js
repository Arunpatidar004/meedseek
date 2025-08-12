import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  appoinment:{type:mongoose.Schema.Types.ObjectId, ref: 'Appoinment'},
  patient:{type:mongoose.Schema.Types.ObjectId, ref: 'Patient'},
  summary:String
});

export default mongoose.model('History', historySchema);
