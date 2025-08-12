import express from 'express';
import { registerDoctor, loginDoctor, getAllPatients,getDoctorById } from '../controllers/doctorController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.post('/register', registerDoctor);
router.post('/login',loginDoctor)
router.get('/get',authMiddleware,getAllPatients)

router.get("/:doctorId",getDoctorById)

export default router;
