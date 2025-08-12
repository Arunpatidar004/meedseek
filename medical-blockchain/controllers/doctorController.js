import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';

export const registerDoctor = async (req, res) => {
  try {
    const { email, name, specialization, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({ email, name, specialization, password: hashed });
    await newDoctor.save();
  res.status(201).json({ message: 'Doctor registered' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
  
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const valid = await bcrypt.compare(password, doctor.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
  
};

export const getAllPatients = async (req,res) => {
    try {
        const doctorId = req.doctorId

        const doctor = await Doctor.findById({doctorId}).populate("patients");
        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

        res.json({patients: doctor.patients });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}


export const getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};