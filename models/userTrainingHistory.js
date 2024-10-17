const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userTrainingHistorySchema = new Schema({
    userId: { type: String, required: true },
    educationId: { type: String, required: true },
    status: {
        type: String,
        enum: ['not_completed', 'in_progress', 'completed'], // Allowed types
        required: true,
    }
  });

const UserTrainingHistory = mongoose.model('UserTrainingHistory', userTrainingHistorySchema);

module.exports = UserTrainingHistory;