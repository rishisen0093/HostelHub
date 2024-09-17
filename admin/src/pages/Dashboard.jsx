import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import "../Dashboard.css";
import messImage from "../assets/images/mess.jpg";

const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // Set initial filtered users
      } catch (error) {
        handleError(error.message);
      }
    };

    const fetchComplaints = async () => {
      try {
        const response = await fetch("http://localhost:8080/complaint/get");
        if (!response.ok) throw new Error("Failed to fetch complaints");
        const data = await response.json();
        if (Array.isArray(data)) {
          setComplaints(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        handleError(error.message);
      }
    };

    fetchUsers();
    fetchComplaints();

    const intervalId = setInterval(() => {
      fetchUsers();
      fetchComplaints();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains("modal")) {
      handleCloseModal();
    }
  };

  const handleDeleteClick = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      handleSuccess("User deleted successfully");
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedUser),
        }
      );
      if (!response.ok) throw new Error("Failed to update user");
      handleSuccess("User updated successfully");
      handleCloseModal();
    } catch (error) {
      handleError(error.message);
    }
  };

  // Get the first 3 recent complaints
  const recentComplaints = complaints.slice(0, 3);

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
          <div className="recent-complaints">
            <h3>Recent Complaints</h3>
            <div className="complaint-cards">
              {recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <div key={complaint._id} className="complaint-card">
                    <div className="complaint-header">
                      <h4>{complaint.subject}</h4>
                      <span
                        className={`status-dot ${
                          complaint.status ? "status-success" : "status-fail"
                        }`}
                      ></span>
                    </div>
                    <p>
                      <strong>Date:</strong> {complaint.date}
                    </p>
                    <p>
                      <strong>Description:</strong> {complaint.description}
                    </p>
                  </div>
                ))
              ) : (
                <p>No recent complaints.</p>
              )}
            </div>
          </div>
          <div className="users">
            <h3>Users</h3>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="user-cards">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user._id} className="user-card">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <button
                      className="update-button"
                      onClick={() => handleUpdateClick(user)}
                    >
                      Update
                    </button>
                    <button onClick={() => handleDeleteClick(user._id)}>
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p>No users available</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <h3>Update User</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={selectedUser?.name || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={selectedUser?.email || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
              </div>
              <button type="submit">Save</button>
            </form>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
