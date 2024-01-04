const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
  mrn: { 
    type: String,
    required: true
  },
  forename: { 
    type: String,
    required: true
  },
  surname: { 
    type: String,
    required: true
  },
  tel: { 
    type: Number
  },
  appointmentDate: { 
    type: Date,
    required: true
  },
  appointmentTime: { 
    type: String,
    required: true
  },
  gestation: { 
    type: Number,
    default: 0
  },
  comment: { 
    type: String, 
    default: ""
  },
  createdOn: {
    type: Date,
    default: Date.now()
  },
  modifiedOn: {
    type: Date,
    default: Date.now()
  },
  seenBy: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    required: true
  },
  attendanceStatus: {
    type: String,
    default: "Not Seen"
  }
},
{ versionKey: false })

module.exports = mongoose.model('Appointment', AppointmentSchema)