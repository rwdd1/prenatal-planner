const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  microsoftId: {
    type: String,
    unique: true,
    required: true
  },
  email: { 
    type: String, 
    unique: true,
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
  jobTitle: {
    type: String
  }  
},
{ versionKey: false })

module.exports = mongoose.model('User', UserSchema)