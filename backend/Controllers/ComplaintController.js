// controllers/ComplaintController.js

const ComplaintModel = require('../Models/Complaint');

const updateComplaintStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Validate the status
        if (typeof status !== 'boolean') {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        // Find and update the complaint
        const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
        );

        if (!updatedComplaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        res.status(200).json({ success: true, data: updatedComplaint });
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { updateComplaintStatus };
