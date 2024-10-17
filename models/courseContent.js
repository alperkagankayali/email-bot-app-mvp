const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseContentSchema = new Schema({
  contentType: {
    type: String,
    enum: ['video', 'quiz', 'reading'], // Allowed types
    required: true,
  },
  contentUrl: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
});

//const CourseContent = mongoose.model('CourseContent', courseContentSchema);
module.exports = courseContentSchema;