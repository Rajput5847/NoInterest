const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://divyanshchauhanrajput5847:harHarMahadev_01@nointerest.m15cwc5.mongodb.net/?retryWrites=true&w=majority");

const userSchema =  mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  profileImage: String,
  boards: {
    type: Array,
    default: []
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ]
});

userSchema.plugin(plm);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel
