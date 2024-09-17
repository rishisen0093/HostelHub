// routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const { addAnnouncement, getAnnouncements } = require('../Controllers/announcementController');

// Route to add a new announcement
router.post('/announcement', addAnnouncement);

// Route to get all announcements
router.get('/announcement', getAnnouncements);

module.exports = router;
