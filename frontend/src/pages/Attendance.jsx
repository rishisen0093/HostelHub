import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import '../Attendance.css'; // Import the CSS file

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');
  const email = localStorage.getItem('loggedInUserEmail') || ''; // Prefill email from localStorage

  // Fetch attendance data on component mount
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('http://localhost:8080/attendance/get'); // Fetch all attendance records

        if (response.data) {
          // Filter records for the logged-in user
          const userAttendance = response.data.filter(record => record.email === email);
          setAttendanceRecords(userAttendance);
        }
      } catch (err) {
        setError('Failed to fetch attendance data');
        console.error(err);
      }
    };

    if (email) {
      fetchAttendance();
    }
  }, [email]);

  const handleCheckIn = async () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    // Check if user already has an active check-in
    const hasActiveCheckIn = attendanceRecords.some(record => !record.checkOutTime);

    if (hasActiveCheckIn) {
      toast.info('You are already checked in. Please check out first.');
      return;
    }

    if (currentHour >= 6 && currentHour < 20) {
      try {
        const response = await axios.post('http://localhost:8080/attendance/checkin', {
          email,
        });

        if (response.status === 200) {
          setAttendanceRecords(prevRecords => [
            {
              email,
              checkInTime: currentTime,
              checkOutTime: null,
            },
            ...prevRecords, // Add the new check-in at the start of the list
          ]);
          toast.success('Checked in successfully!');
        } else {
          throw new Error('Failed to check in');
        }
      } catch (err) {
        toast.error('Error during check-in.');
        console.error(err);
      }
    } else {
      toast.info('You cannot check in before 6 am.');
    }
  };

  const handleCheckOut = async () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 6 && currentHour <= 20) {
      try {
        // Check if there's an active check-in to pair with the check-out
        const activeCheckIn = attendanceRecords.find(record => !record.checkOutTime);

        if (activeCheckIn) {
          const response = await axios.post('http://localhost:8080/attendance/checkout', {
            email,
          });

          if (response.status === 200) {
            setAttendanceRecords(prevRecords =>
              prevRecords.map(record =>
                record.email === email && !record.checkOutTime
                  ? { ...record, checkOutTime: currentTime }
                  : record
              )
            );
            toast.success('Checked out successfully!');
          } else {
            throw new Error('Failed to check out');
          }
        } else {
          toast.info('No active check-in found. Please check in first.');
        }
      } catch (err) {
        toast.error('Error during check-out.');
        console.error(err);
      }
    } else {
      toast.info('You cannot check out after 8 pm.');
    }
  };

  // Display only the last 10 attendance records
  const recentRecords = attendanceRecords.slice(0, 10);

  return (
    <div className="attendance-container">
      <h1 className="title">Attendance</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="button-container">
        <button className="checkin-button" onClick={handleCheckIn}>Check In</button>
        <button className="checkout-button" onClick={handleCheckOut}>Check Out</button>
      </div>
      <div className="attendance-records">
        {recentRecords.length > 0 ? (
          recentRecords.map((record, index) => (
            <div className="attendance-record" key={index}>
              <p className={`record-time ${record.checkInTime ? 'checkin-highlight' : ''}`}>
                Check-In Time: {record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'Not checked in'}
              </p>
              <p className={`record-time ${record.checkOutTime ? 'checkout-highlight' : ''}`}>
                Check-Out Time: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : 'Not checked out'}
              </p>
              <hr className="record-divider" />
            </div>
          ))
        ) : (
          <p className="no-records">No attendance records found.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Attendance;
