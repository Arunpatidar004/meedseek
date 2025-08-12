import express from 'express';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from "cors";

import recordRoutes from './routes/recordRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';

import { Blockchain } from './libs/blockchain.js';

import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from "./libs/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
global.medicalChain = new Blockchain();



const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

global.io = io;

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('joinDoctorRoom', (doctorId) => {
    socket.join(`doctor:${doctorId}`);
  });
});


app.use('/api/records', recordRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);

app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`)
        connectDB();
})
