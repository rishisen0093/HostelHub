const mongoose = require('mongoose');

const GatepassSchema = new mongoose.Schema({
  email: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  leaveFrom: { type: Date, required: true },
  leaveTill: { type: Date, required: true },
  approval: { type: Boolean, default: false }  // default is false
});

const Gatepass = mongoose.model('Gatepass', GatepassSchema);

module.exports = Gatepass;
