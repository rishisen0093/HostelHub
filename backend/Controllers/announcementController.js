// controllers/announcementController.js
const Announcement = require('../Models/Announcement');

// Controller to add a new announcement
const addAnnouncement = async (req, res) => {
  try {
    const { title, content, datePosted } = req.body;
    const newAnnouncement = new Announcement({
      title,
      content,
      datePosted: datePosted ? new Date(datePosted) : undefined, // Convert datePosted to Date object if provided
    });
    await newAnnouncement.save();
    res.status(201).json({ message: 'Announcement created successfully', announcement: newAnnouncement });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create announcement', error: error.message });
  }
};

// Controller to get all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve announcements', error: error.message });
  }
};

module.exports = {
  addAnnouncement,
  getAnnouncements
};
