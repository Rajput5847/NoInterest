const mongoose = require('mongoose');

const postSchema =  mongoose.Schema({
  title: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  description: String,
  image: String
});


const userModel = mongoose.model("post", postSchema);

module.exports = userModel