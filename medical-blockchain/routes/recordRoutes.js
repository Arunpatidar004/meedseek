import express from 'express';
import multer from 'multer';
import {
  addRecord,
  getRecords,
  getPatientReport,
  verifyIntegrity,
  getRecordWithFile
} from '../controllers/recordController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/add', upload.single('file'), addRecord);
router.get('/getRecord/:cid', getRecordWithFile);
router.get('/get/:patientId', getRecords);
router.get('/report/:patientId', getPatientReport);
router.get('/verify', verifyIntegrity);



export default router;
