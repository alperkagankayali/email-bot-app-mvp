const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userActionSchema = new Schema({
    userId: { type: String, required: true },
    campaingId: { type: String, required: true },
    action: { 
        type: String,
        enum: ["not_opened", "opened", "clicked", "data_entered"], 
        required: true 
    },
    actionDate: { type: Date, default: Date.now },
  });

const UserAction = mongoose.model('UserAction', userActionSchema);
module.exports = UserAction;