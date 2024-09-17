const Attendance = require('../Models/Attendance');

exports.checkIn = async (req, res) => {
  const { email } = req.body;
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  if (currentHour < 6) {
    return res.status(400).json({ message: 'Cannot check in before 6 am.' });
  }

  try {
    const attendance = new Attendance({ email, checkInTime: currentTime });
    await attendance.save();
    res.status(200).json({ message: 'Checked in successfully!', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error checking in', error });
  }
};

exports.checkOut = async (req, res) => {
  const { email } = req.body;
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  if (currentHour >= 20) {
    return res.status(400).json({ message: 'Cannot check out after 8 pm.' });
  }

  try {
    const attendance = await Attendance.findOne({ email, checkOutTime: null });
    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for checkout.' });
    }

    attendance.checkOutTime = currentTime;
    await attendance.save();
    res.status(200).json({ message: 'Checked out successfully!', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error checking out', error });
  }
};

exports.getAllAttendance = async (req, res) => {
    try {
      const attendances = await Attendance.find(); // Get all attendance records
      res.status(200).json(attendances);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving attendance data', error });
    }
  };


  
