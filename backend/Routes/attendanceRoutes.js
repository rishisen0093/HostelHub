const express = require('express');
const router = express.Router();
const AttendanceController = require('../Controllers/attendanceController');

// Route for check-in
router.post('/checkin', AttendanceController.checkIn);

// Route for check-out
router.post('/checkout', AttendanceController.checkOut);

router.get('/get', AttendanceController.getAllAttendance);

module.exports = router;
