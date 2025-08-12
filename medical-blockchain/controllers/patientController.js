import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

export const registerPatient = async (req, res) => {
  try {
    const { name ,age, doctorId,email } = req.body;

    let doctorExist = await Doctor.findById(doctorId);
    if (!doctorExist) return res.status(404).json({ error: 'Doctor not found' });

    const newPatient = new Patient({ name, email,age });
    
    doctorExist.patients.push(newPatient._id);
    await doctorExist.save();
    
    newPatient.doctor = doctorExist._id;
    await newPatient.save();
    res.status(201).json({ message: 'Patient registered' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
  
}


export const getPatientById = async (req,res) => {
    try {
       const { patientId } = req.params; 

       const patientExist = await Patient.findOne({patiendId : patientId});
       if (!patientExist) return res.status(404).json({error:"No Patient Found"})

       res.json(patientExist);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}