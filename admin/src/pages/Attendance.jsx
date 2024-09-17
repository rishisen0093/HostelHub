import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications
import "../Attendance.css"; // Import the CSS file

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState("");

  // Fetch all attendance data on component mount
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/attendance/get"
        );

        if (response.data) {
          setAttendanceRecords(response.data);
        }
      } catch (err) {
        setError("Failed to fetch attendance data");
        console.error(err);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="attendance-container">
      <h1 className="title">All Users' Attendance</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="attendance-list">
        {attendanceRecords.length > 0 ? (
          attendanceRecords.map((record, index) => (
            <div className="attendance-item" key={index}>
              <p className="item-email">{record.email}</p>
              <p
                className={`item-time ${
                  record.checkInTime ? "checkin-highlight" : ""
                }`}
              >
                Check-In Time:{" "}
                {record.checkInTime
                  ? new Date(record.checkInTime).toLocaleString()
                  : "Not checked in"}
              </p>
              <p
                className={`item-time ${
                  record.checkOutTime ? "checkout-highlight" : ""
                }`}
              >
                Check-Out Time:{" "}
                {record.checkOutTime
                  ? new Date(record.checkOutTime).toLocaleString()
                  : "Not checked out"}
              </p>
              <hr className="item-divider" />
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
