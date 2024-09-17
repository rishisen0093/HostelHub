import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import '../Announcement.css';

// Set the app element for react-modal (for accessibility purposes)
Modal.setAppElement('#root');

const Announcement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:8080/announcement');
        console.log('Raw data fetched:', response.data); // Debugging line
        const announcementsData = response.data;
        if (announcementsData.length > 0) {
          const sortedAnnouncements = announcementsData.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
          setAnnouncements(sortedAnnouncements);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datePosted = new Date().toISOString();

    try {
      await axios.post('http://localhost:8080/announcement', {
        title,
        content,
        datePosted,
      });
      toast.success('Announcement posted successfully');

      // Refresh the announcements list
      const response = await axios.get('http://localhost:8080/announcement');
      const announcementsData = response.data;
      const sortedAnnouncements = announcementsData.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
      setAnnouncements(sortedAnnouncements);
      console.log('Updated announcements:', sortedAnnouncements); // Debugging line

      setTitle('');
      setContent('');
      setModalIsOpen(false); // Close the modal
    } catch (error) {
      toast.error('Failed to post announcement');
      console.error('Error posting announcement:', error);
    }
  };

  return (
    <div className="announcement-container">
      <div className="form-and-announcements">
        <div className="announcement-form-container">
          <button className="form-button" onClick={() => setModalIsOpen(true)}>Post Announcement</button>
        </div>
        <div className="all-announcements-container">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div key={announcement._id} className="announcement-card">
                <h3 className="announcement-card-title">{announcement.title}</h3>
                <p className="announcement-card-date">{new Date(announcement.datePosted).toLocaleString()}</p>
                <p className="announcement-card-content">{announcement.content}</p>
              </div>
            ))
          ) : (
            <p className="no-announcement">No announcements available.</p>
          )}
        </div>
      </div>

      {/* Modal for posting announcement */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Post Announcement"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2 className="announcement-title">Post an Announcement</h2>
        <form className="announcement-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title:</label>
            <input
              className="form-input"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="content">Content:</label>
            <textarea
              className="form-textarea"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button className="form-button" type="submit">Post Announcement</button>
        </form>
      </Modal>

      <ToastContainer className="toast-container" />
    </div>
  );
};

export default Announcement;
