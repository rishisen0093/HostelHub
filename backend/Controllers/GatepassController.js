// controllers/gatepassController.js
const Gatepass = require('../Models/GatePass');


// Create gatepass request
exports.createGatepass = async (req, res) => {
  try {
    const { subject, description, leaveFrom, leaveTill, user } = req.body;

    const newGatepass = new Gatepass({
      user,
      subject,
      description,
      leaveFrom,
      leaveTill,
      requestStatus: 'false'  // Default status
    });

    await newGatepass.save();
    res.status(201).json({ message: 'Gatepass request submitted', gatepass: newGatepass });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit gatepass request' });
  }
};

// Get all gatepass requests (for admin)
exports.getGatepassRequests = async (req, res) => {
  try {
    const gatepasses = await Gatepass.find();
    res.status(200).json(gatepasses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gatepasses' });
  }
};

// Approve or Deny gatepass
exports.updateGatepassStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestStatus } = req.body; // 'approved' or 'denied'

    const gatepass = await Gatepass.findById(id);
    if (!gatepass) {
      return res.status(404).json({ error: 'Gatepass not found' });
    }

    gatepass.requestStatus = requestStatus;
    await gatepass.save();

    res.status(200).json({ message: `Gatepass ${requestStatus}`, gatepass });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gatepass status' });
  }
};
