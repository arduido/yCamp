const mongoose = require('mongoose');
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment" //the name of the model
    }
  ]
});
module.exports = mongoose.model('Campground', campgroundSchema);
