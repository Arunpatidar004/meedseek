import express from 'express';
import { registerPatient, getPatientById } from '../controllers/patientController.js';


const router = express.Router();
router.post('/registerPatient', registerPatient);
router.get('/get/:PatientId',getPatientById);

export default router;
