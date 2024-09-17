import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./LeavePassDetails.css"; // Import CSS file for styling

const LeavePassDetails = () => {
  const { id } = useParams();
  const [leavePass, setLeavePass] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchLeavePass = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/gatepass/id/${id}`
        );
        setLeavePass(response.data);
      } catch (error) {
        console.error("Error fetching leave pass details:", error);
      }
    };

    fetchLeavePass();
  }, [id]);

  return (
    <div className="leave-pass-details-wrapper">
      {leavePass ? (
        <div className="leave-pass-card">
          <div className="leave-pass-header">
            <h2 className="leave-pass-title">Leave Pass Details</h2>
            {leavePass.approval && (
              <span className="leave-pass-status-approved">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                    fill="#4CAF50"
                  />
                </svg>
              </span>
            )}
          </div>
          <div className="leave-pass-body">
            <p>
              <strong>Subject:</strong> {leavePass.subject}
            </p>
            <p className="description">
              <strong>Description:</strong>
              {showFullDescription
                ? leavePass.description
                : `${leavePass.description.substring(0, 100)}...`}
            </p>
            <p>
              <strong>Leave From:</strong>{" "}
              {new Date(leavePass.leaveFrom).toLocaleDateString()}
            </p>
            <p>
              <strong>Leave Till:</strong>{" "}
              {new Date(leavePass.leaveTill).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {leavePass.approval ? "Approved" : "Pending"}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LeavePassDetails;
