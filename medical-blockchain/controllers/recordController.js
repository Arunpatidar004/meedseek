
import fs from 'fs';
import { Block } from '../libs/blockchain.js';
import { encrypt, secureEncryptKey } from '../libs/encryption.js';
import { ipfs } from '../libs/ipfs.js';
import Patient from '../models/Patient.js';
import Record from '../models/Record.js';
import { decrypt,secureDecryptKey } from '../libs/encryption.js';
import axios from 'axios';


export const addRecord = async (req, res) => {
  try {
    const { patientId, disease, description } = req.body;
    console.log(typeof(req.file),req.body);
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ error: 'No file uploaded' });

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const file = fs.readFileSync(filePath);
    const encrypted = encrypt(file.toString('base64'));

    const encryptedBuffer = Buffer.from(JSON.stringify({
      content: encrypted.content,
      iv: encrypted.iv
    }));

    const result = await ipfs.add(encryptedBuffer);
    fs.unlinkSync(filePath);

    const newBlock = new Block(
      medicalChain.chain.length,
      new Date().toISOString(),
      patientId,
      result.cid.toString()
    );
    medicalChain.addBlock(newBlock);
    

    const record = new Record({
    patient: patient._id,
    files: [{
      id: result.cid.toString(),
      name: req.file.originalname,
      filetype: req.file.mimetype,
      size: req.file.size,
      encryption: {
        key: secureEncryptKey(encrypted.key),
        iv: secureEncryptKey(encrypted.iv)
      }
    }]
  });

    await record.save();
    patient.records.push(record._id);
    await patient.save();

    res.json({ message: 'Record added successfully', cid: result.cid.toString(), record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getRecords = (req, res) => {
  const { patientId } = req.params;
  const records = medicalChain.getRecordsByPatientId(patientId);
  res.send(records);
};

export const getPatientReport = (req, res) => {
  const { patientId } = req.params;
  const records = medicalChain.getRecordsByPatientId(patientId);
  console.log(records);
  res.render('patientReport', { reports: records });
};

export const verifyIntegrity = (req, res) => {
  const isValid = medicalChain.verifyRecordIntegrity();
  res.send({ valid: isValid });
};



export const getRecordWithFile = async (req, res) => {
  try {
    const { cid } = req.params;
    if (!cid) return res.status(400).json({ error: 'No file associated' });

    const record = await Record.findOne({ "files.id": cid });
    if (!record) return res.status(404).json({ error: 'Record not found for CID' });

    const fileMeta = record.files.find(f => f.id === cid);
    if (!fileMeta?.encryption?.key || !fileMeta.encryption.iv)
      return res.status(400).json({ error: 'Missing encryption metadata' });

    // Fetch from IPFS as raw text
    const response = await axios.get(`http://127.0.0.1:8080/ipfs/${cid}`, {
      responseType: 'text'
    });

    const encryptedData = JSON.parse(response.data);

    const decryptedKey = secureDecryptKey(fileMeta.encryption.key);
    const decryptedIv = secureDecryptKey(fileMeta.encryption.iv);

    const decryptedBase64 = decrypt(encryptedData, decryptedKey, decryptedIv);
    const fileBuffer = Buffer.from(decryptedBase64, 'base64');

    res.setHeader('Content-Type', fileMeta.type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${fileMeta.name || 'record-file'}"`);

    res.send(fileBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    res.status(500).json({ error: 'Failed to fetch or decrypt file' });
  }
};


