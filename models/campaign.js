const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Scenario = require('./scenario');
const campaignSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  userList: [{
    type: String, required: true,
  }],
  scenario: { type: Schema.Types.ObjectId, ref: 'Scenario', required: true },
  author: String,
  created_at: { type: Date, default: Date.now },
});

// Creating the Course model from the schema
const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;