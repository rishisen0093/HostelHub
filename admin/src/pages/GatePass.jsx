import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminGatePasses.css'; // Import CSS file for styling

const AdminGatePasses = () => {
  const [gatepasses, setGatepasses] = useState([]);

  useEffect(() => {
    const fetchGatepasses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/gatepass/');
        setGatepasses(response.data);
      } catch (error) {
        console.error('Error fetching gatepasses:', error);
      }
    };

    fetchGatepasses();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:8080/gatepass/update/${id}`, { approval: status });
      setGatepasses(gatepasses.map(gatepass =>
        gatepass._id === id ? { ...gatepass, approval: status } : gatepass
      ));
    } catch (error) {
      console.error('Error updating gatepass status:', error);
    }
  };

  return (
    <div className="admin-gatepass-container">
      <h2>Manage Gate Passes</h2>
      {gatepasses.length === 0 ? (
        <p>No gate passes found.</p>
      ) : (
        <div className="gatepass-list">
          {gatepasses.map((gatepass) => (
            <div className="gatepass-card" key={gatepass._id}>
              <h3>{gatepass.subject}</h3>
              <p><strong>User Email:</strong> {gatepass.email}</p> 
              <p><strong>Description:</strong> {gatepass.description}</p>
              <p><strong>Leave From:</strong> {new Date(gatepass.leaveFrom).toLocaleDateString()}</p>
              <p><strong>Leave Till:</strong> {new Date(gatepass.leaveTill).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {gatepass.approval ? 'Approved' : 'Pending'}</p>
              <div className="gatepass-actions">
                <button 
                  className="accept-button" 
                  onClick={() => handleStatusUpdate(gatepass._id, true)}
                >
                  Accept
                </button>
                <button 
                  className="deny-button" 
                  onClick={() => handleStatusUpdate(gatepass._id, false)}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGatePasses;
