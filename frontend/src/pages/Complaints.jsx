import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Complaints.css';

const Complaints = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: localStorage.getItem('loggedInUserEmail') || '', // Prefill email from localStorage
    date: '',
    subject: '',
    description: '',
    status: false,
  });

  const [complaints, setComplaints] = useState([]); // State to store fetched complaints
  const [pollingInterval, setPollingInterval] = useState(2000); // Polling interval in milliseconds (10 seconds)

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to fetch complaints
  const fetchComplaints = async () => {
    try {
      const response = await fetch(`http://localhost:8080/complaint/get`);
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      const result = await response.json();
      console.log('Form submitted:', result);

      // Show toast message on success
      toast.success('Complaint submitted successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });

      // Reset form data
      setFormData({
        email: localStorage.getItem('loggedInUserEmail') || '', // Keep email prefilled
        date: '',
        subject: '',
        description: '',
        status: false,
      });

      // Refresh complaints list
      fetchComplaints(); // Fetch complaints after successful form submission
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('There was an error submitting your complaint. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  // Set up polling to fetch complaints data at regular intervals
  useEffect(() => {
    fetchComplaints(); // Fetch complaints on mount

    const intervalId = setInterval(() => {
      fetchComplaints(); // Fetch complaints periodically
    }, pollingInterval);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [pollingInterval]);

  return (
    <div className="complaints-page">
      <ToastContainer />
      {/* Flexbox Container for side-by-side layout */}
      <div className="complaints-container">
        <form onSubmit={handleSubmit} className="complaints-form">
          <h2 className="complaints-form-heading">Submit a Complaint</h2>

          <div className="complaints-form-group">
            <label htmlFor="date" className="complaints-form-label">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              className="complaints-form-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="complaints-form-group">
            <label htmlFor="subject" className="complaints-form-label">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder='define your subject'
              className="complaints-form-input"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="complaints-form-group">
            <label htmlFor="description" className="complaints-form-label">Description:</label>
            <textarea
              id="description"
              name="description"
              className="complaints-form-textarea"
              placeholder='pls give a description'
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="complaints-form-button">Submit Complaint</button>
        </form>

        {/* Section to Display User Complaints */}
        <div className="complaints-list">
          <h3 className="complaints-list-heading">Your Complaints</h3>
          {complaints.length > 0 ? (
            complaints
              .filter(complaint => complaint.email === formData.email) // Filter complaints based on email
              .map((complaint) => (
                <div key={complaint._id} className="complaint-item">
                  <p className="complaint-item-detail"><strong>Date:</strong> {complaint.date}</p>
                  <p className="complaint-item-detail"><strong>Subject:</strong> {complaint.subject}</p>
                  <p className="complaint-item-detail"><strong>Description:</strong> {complaint.description}</p>
                  <p className="complaint-item-detail">
                    <strong>Status:</strong> 
                    <span
                      className={`glowing-dot ${complaint.status ? '' : 'red'}`}
                      style={{
                        backgroundColor: complaint.status ? 'green' : 'red',
                      }}
                    ></span>
                  </p>
                </div>
              ))
          ) : (
            <p className="complaints-list-empty">No complaints found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Complaints;
