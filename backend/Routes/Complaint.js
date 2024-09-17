const express = require('express');
const Complaint = require('../Models/Complaint');  // Import the Complaint model
const { updateComplaintStatus } = require('../Controllers/ComplaintController');
const router = require('express').Router();

router.patch('/update/:id', updateComplaintStatus);

// POST a new complaint
router.post('/', async (req, res) => {
  try {
    console.log("dfghj");
    console.log(req.body);
    const newComplaint = new Complaint(req.body);
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Error saving complaint', error });
  }
});

// GET all complaints
router.get('/get', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving complaints', error });
  }
});

module.exports = router;
