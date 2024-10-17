const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  headline: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  
  // Required: One reading material for each news
  readingMaterialUrl: {type: String, required: true},
  
  questionnaireType: {
    type: String,
    enum: ["action", "quiz"],
    required: true,
  },

  questionnaireUrl: {type: String, required: true},
});

const News = mongoose.model('News', newsSchema);

module.exports = News;