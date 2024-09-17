import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Complaints.css';

const Complaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [pollingInterval] = useState(2000); // Polling interval in milliseconds (2 seconds)

    const fetchComplaints = async () => {
        try {
            console.log('Fetching complaints...');
            const response = await axios.get('http://localhost:8080/complaint/get');
            console.log('Data received:', response.data);

            if (Array.isArray(response.data)) {
                // Sort complaints by date in descending order
                const sortedComplaints = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setComplaints(sortedComplaints);
            } else {
                console.error('Unexpected response format:', response.data);
                toast.error('Unexpected response format.');
            }
        } catch (error) {
            console.error('Error fetching complaints:', error);
            toast.error(`Error fetching complaints: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchComplaints(); // Fetch complaints on mount
    
        const intervalId = setInterval(() => {
            fetchComplaints(); // Fetch complaints periodically
        }, pollingInterval);
    
        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [pollingInterval]); // Dependencies array ensures effect runs on mount and when pollingInterval changes

    const updateComplaintStatus = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:8080/complaint/update/${id}`, { status: true });
            if (response.data.success) {
                // Update the local state
                setComplaints((prevComplaints) =>
                    prevComplaints.map((complaint) =>
                        complaint._id === id
                            ? { ...complaint, status: true }
                            : complaint
                    )
                );
                toast.success('Complaint status updated successfully.');
            } else {
                toast.error('Failed to update complaint status.');
            }
        } catch (error) {
            console.error('Error updating complaint status:', error);
            toast.error(`Error updating complaint status: ${error.message}`);
        }
    };

    return (
        <div className="complaint-page">
            <ToastContainer />
            <h1 className="complaint-title">All Complaints</h1>
            <div className="complaint-list-container">
                {complaints.length > 0 ? (
                    complaints.map((complaint) => (
                        <div key={complaint._id} className="complaint-card">
                            <p><strong>Date:</strong> {new Date(complaint.date).toLocaleString()}</p>
                            <p><strong>Subject:</strong> {complaint.subject}</p>
                            <p><strong>Description:</strong> {complaint.description}</p>
                            <p>
                                <strong>Status:</strong>
                                <span
                                    className={`status-dot ${complaint.status ? 'status-success' : 'status-fail'}`}
                                ></span>
                            </p>
                            {!complaint.status && (
                                <button 
                                    onClick={() => updateComplaintStatus(complaint._id)}
                                    className="update-status-button"
                                >
                                    Mark as Resolved
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="complaint-empty">No complaints found.</p>
                )}
            </div>
        </div>
    );
};

export default Complaint;
