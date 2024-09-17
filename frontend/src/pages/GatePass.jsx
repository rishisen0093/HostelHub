import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QRCodeSVG } from 'qrcode.react';
import "../GatepassForm.css";

const GatepassForm = () => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem("loggedInUserEmail") || "",
    subject: "",
    description: "",
    leaveFrom: "",
    leaveTill: "",
    approval: false,
  });

  const [leavePasses, setLeavePasses] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [newGatepass, setNewGatepass] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState("");
  const [hasPendingGatepass, setHasPendingGatepass] = useState(false);

  useEffect(() => {
    // Get tomorrow's date and date 3 months from tomorrow
    const today = new Date();
    today.setDate(today.getDate() + 1); // Set to tomorrow
    const tomorrowDate = today.toISOString().split("T")[0];
    setMinDate(tomorrowDate);

    const threeMonthsFromTomorrow = new Date();
    threeMonthsFromTomorrow.setMonth(threeMonthsFromTomorrow.getMonth() + 3);
    const maxDateString = threeMonthsFromTomorrow.toISOString().split("T")[0];
    setMaxDate(maxDateString);

    // Fetch all leave passes
    const fetchLeavePasses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/gatepass");
        const email = localStorage.getItem("loggedInUserEmail");
        // Filter leave passes for the logged-in user
        const filteredPasses = response.data.filter(
          (pass) => pass.email === email
        );
        setLeavePasses(filteredPasses);

        // Check if there's a pending gatepass
        const hasPending = filteredPasses.some(pass => !pass.approval);
        setHasPendingGatepass(hasPending);
      } catch (error) {
        console.error("Error fetching leave passes", error);
        toast.error("Failed to fetch leave passes");
      }
    };

    fetchLeavePasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let validationErrors = {};

    // Check date validations
    if (formData.leaveFrom > formData.leaveTill) {
      validationErrors.leaveFrom =
        "Leave From date cannot be later than Leave Till date";
      validationErrors.leaveTill =
        "Leave Till date cannot be earlier than Leave From date";
    }

    if (formData.leaveFrom === formData.leaveTill) {
      validationErrors.leaveTill =
        "Leave Till date cannot be the same as Leave From date";
    }

    // Check description length
    if (formData.description.length < 50) {
      validationErrors.description =
        "Description must be at least 50 characters long";
    }

    // Show toast messages for validation errors
    Object.values(validationErrors).forEach((errorMessage) => {
      toast.error(errorMessage, {
        position: "top-right",
        style: { backgroundColor: "yellow", color: "black" },
      });
    });

    return Object.keys(validationErrors).length === 0; // return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if there's an existing pending gatepass
    if (hasPendingGatepass) {
      toast.error("You already have a pending gatepass. Please wait for it to be processed before submitting a new one.");
      return;
    }
  
    // Validate form
    if (!validateForm()) {
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8080/gatepass/create",
        formData
      );
      toast.success("Gatepass request submitted successfully!");
      setNewGatepass(response.data.gatepass);
      setQRCodeData(
        `https://yourdomain.com/leavepass/${response.data.gatepass._id}`
      );
      setShowQRCode(false);
  
      // Fetch updated leave passes
      const fetchLeavePasses = async () => {
        try {
          const response = await axios.get("http://localhost:8080/gatepass");
          const email = localStorage.getItem("loggedInUserEmail");
          const filteredPasses = response.data.filter(
            (pass) => pass.email === email
          );
          setLeavePasses(filteredPasses);
  
          // Update the pending status
          const hasPending = filteredPasses.some(pass => !pass.approval);
          setHasPendingGatepass(hasPending);
        } catch (error) {
          console.error("Error fetching leave passes", error);
          toast.error("Failed to fetch leave passes");
        }
      };
  
      fetchLeavePasses();
    } catch (error) {
      console.error("Error submitting gatepass request", error);
      toast.error("Failed to submit gatepass request");
    }
  };
  

  const handleShowQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <div className="gatepass-form-container">
      <div className="form-container">
        <h2>Request Gatepass</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Subject of Leave:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Description of Leave:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              minLength="50" // HTML5 validation
              required
            ></textarea>
            {formData.description.length < 50 && (
              <p className="error">
                Description must be at least 50 characters long
              </p>
            )}
          </div>
          <div>
            <label>Leave From:</label>
            <input
              type="date"
              name="leaveFrom"
              value={formData.leaveFrom}
              onChange={handleChange}
              min={minDate}
              max={maxDate}
              required
            />
          </div>
          <div>
            <label>Leave Till:</label>
            <input
              type="date"
              name="leaveTill"
              value={formData.leaveTill}
              onChange={handleChange}
              min={formData.leaveFrom || minDate}
              max={maxDate}
              required
            />
          </div>
          <input type="hidden" name="approval" value={formData.approval} />
          <button type="submit" disabled={hasPendingGatepass}>Submit</button>
        </form>

        {/* Display the newly created gatepass */}
      </div>

      {/* Display all leave passes in card layout */}
      <div className="cards-container-wrapper">
        <div className="leave-passes">
          <h3>Your Leave Passes</h3>
          {leavePasses.length === 0 ? (
            <p>No leave passes found.</p>
          ) : (
            <div className="cards-container">
              {leavePasses.map((pass) => (
                <div className="card" key={pass._id}>
                  <h4>{pass.subject}</h4>
                  <p>
                    <strong>Description:</strong> {pass.description}
                  </p>
                  <p>
                    <strong>Leave From:</strong>{" "}
                    {new Date(pass.leaveFrom).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Leave Till:</strong>{" "}
                    {new Date(pass.leaveTill).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span className="card-status">
                      {pass.approval ? (
                        <span className="status-dot status-approved"></span>
                      ) : (
                        <span className="status-dot status-pending"></span>
                      )}
                      {pass.approval ? "Approved" : "Pending"}
                    </span>
                  </p>
                  {pass.approval && (
                    <QRCodeSVG
                      value={`http://192.168.29.154:3001/leavepass/id/${pass._id}`}
                      className="qr-code"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default GatepassForm;
