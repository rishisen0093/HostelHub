const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  checkInTime: {
    type: Date,
    default: null,
  },
  checkOutTime: {
    type: Date,
    default: null,
  },
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
