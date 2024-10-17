const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userTrainingAssignmentSchema = new Schema({
    userId: { type: String, required: true },
    educationId: { type: String, required: true },
  });

const UserTrainingAssignment = mongoose.model('UserTrainingAssignment', userTrainingAssignmentSchema);
module.exports = UserTrainingAssignment;