const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scenarioSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    scenarioType: {
        type: String,
        enum: ['data_entry', 'clickable_link'],
        required: true,
    },
    emailUrl: { type: String, required: true },
    landingPageUrl: { type: String, required: true },
    dataEntryPageUrl: String,
    author: String,
    created_at: { type: Date, default: Date.now() },
});

// Creating the Course model from the schema
const Scenario = mongoose.model('Scenario', scenarioSchema);

module.exports = Scenario;