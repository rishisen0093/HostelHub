const express = require("express");
const router = express.Router();
const Gatepass = require("../Models/GatePass"); // Adjust path as needed

// Create a new gatepass
router.post("/create", async (req, res) => {
  try {
    const newGatepass = new Gatepass(req.body);
    await newGatepass.save();
    res.status(201).json({
      message: "Gatepass request submitted successfully!",
      gatepass: newGatepass, // Return the saved gatepass including its ID
    });
  } catch (error) {
    console.error("Error saving gatepass:", error);
    res.status(500).json({ message: "Failed to submit gatepass request" });
  }
});

// Fetch all gatepasses
router.get("/", async (req, res) => {
  try {
    const gatepasses = await Gatepass.find(); // Fetch all gatepasses
    res.status(200).json(gatepasses);
  } catch (error) {
    console.error("Error fetching gatepasses:", error);
    res.status(500).json({ message: "Error fetching gatepasses" });
  }
});

// Fetch a gatepass by ID (for QR code generation)
router.get("/id/:id", async (req, res) => {
  try {
    const gatepassId = req.params.id;
    const gatepass = await Gatepass.findById(gatepassId);
    if (!gatepass) {
      return res
        .status(404)
        .json({ message: "No gatepass found with this ID" });
    }
    res.status(200).json(gatepass);
  } catch (error) {
    console.error("Error fetching gatepass by ID:", error);
    res.status(500).json({ message: "Error fetching gatepass" });
  }
});

// Update gatepass status
router.patch("/update/:id", async (req, res) => {
  try {
    const gatepassId = req.params.id;
    const { approval } = req.body;
    const gatepass = await Gatepass.findByIdAndUpdate(
      gatepassId,
      { approval },
      { new: true } // Return the updated document
    );

    if (!gatepass) {
      return res
        .status(404)
        .json({ message: "No gatepass found with this ID" });
    }
    res.status(200).json(gatepass);
  } catch (error) {
    console.error("Error updating gatepass status:", error);
    res.status(500).json({ message: "Error updating gatepass status" });
  }
});

module.exports = router;
