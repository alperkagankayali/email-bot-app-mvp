const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    language: { type: String, required: true },
    department: String,
    userType: { 
        type: String,
        enum: ["user", "admin"], 
        required: true 
    },
  });

const User = mongoose.model('User', userSchema);

module.exports = User;