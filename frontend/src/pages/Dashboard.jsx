import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import { handleError, handleSuccess } from "../utils";
import "../Dashboard.css";
import messImage from "../assets/images/mess.jpg";

const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));

    const fetchRecentAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:8080/announcement");
        const announcements = response.data;
        if (announcements.length > 0) {
          const sortedAnnouncements = announcements.sort(
            (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
          );
          setRecentAnnouncements(sortedAnnouncements.slice(0, 3)); // Get the top 3 announcements
        }
      } catch (error) {
        handleError("Error fetching announcements");
        console.error("Error fetching announcements:", error);
      }
    };

    fetchRecentAnnouncements();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleReadAll = () => {
    navigate("/notice");
  };

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <div className="welcome-section">
          <h2>
            Welcome to <span>HostelHub</span>
          </h2>
          <p>
            Experience comfort and community in a home away from home. At
            HostelHub, we prioritize your safety, convenience, and peace of
            mind.
          </p>
        </div>
        <div className="content-grid">
          <div className="mess-details">
            <img src={messImage} alt="Mess Details" />
            <h3>Mess Details</h3>
            <p>Active from Jan 23, 2024</p>
            <div className="mess-stats">
              <div>
                <span>Used </span>
                <span>₹14K</span>
              </div>
              <div>
                <span>Left </span>
                <span>₹10.5K</span>
              </div>
              <div>
                <span>Total </span>
                <span>₹24.5K</span>
              </div>
            </div>
          </div>
          <div className="announcements">
            <h3>Announcements</h3>
            {recentAnnouncements.length > 0 ? (
              <div className="announcements-list">
                {recentAnnouncements.map((announcement, index) => (
                  <div className="announcement-card" key={index}>
                    <h4>{announcement.title}</h4>
                    <p className="announcement-date">
                      {new Date(announcement.datePosted).toLocaleString()}
                    </p>
                    <p>{announcement.content}</p>
                  </div>
                ))}
                <button className="read-all-button" onClick={handleReadAll}>
                  Read All
                </button>
              </div>
            ) : (
              <p>No recent announcements available.</p>
            )}
          </div>
        </div>{" "}
      </main>
    </div>
  );
};

export default Dashboard;
