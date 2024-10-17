const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseContentSchema = require('./courseContent');
const courseSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    author: String,
    created_at: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
    contents: [courseContentSchema],
});

// Creating the Course model from the schema
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;