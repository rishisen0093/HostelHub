const mongoose = require('mongoose');


const complaintSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status:{
    type: Boolean
  }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;


// const mongoose = require('mongoose');

// const complaintSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   date: { type: String, required: true },
//   subject: { type: String, required: true },
//   description: { type: String, required: true },
// });

// const Complaint = mongoose.model('complaint', complaintSchema);

// module.exports = Complaint;
