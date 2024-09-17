const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const Complaint = require('./Routes/Complaint');
const announcementRoutes = require('./Routes/announcementRoutes');
const attendanceRoutes = require('./Routes/attendanceRoutes');
const gatepassRoutes=require('./Routes/GatePassRoutes');
const userRoutes=require('./Routes/userRoutes')

app.use(express.json());
require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});
app.use(cors());
app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/complaint', Complaint);
app.use('/', announcementRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/gatepass', gatepassRoutes);
app.use('/users', userRoutes);




app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})