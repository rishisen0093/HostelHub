  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import '../Announcement.css';

  const Announcement = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
      const fetchAnnouncements = async () => {
        try {
          const response = await axios.get('http://localhost:8080/announcement');
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

    return (
      <div className="announcement-page-container">
        <h1 className="announcement-page-title">Announcements</h1>
        <div className="announcement-cards-container">
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
    );
  };

  export default Announcement;
