const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const dbUrl = "mongodb+srv://NoInterestUser:yeaajkalkenalleberojgarchaprichapallchor@nointerest.m15cwc5.mongodb.net/NoInterestDatabase?retryWrites=true&w=majority";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect(dbUrl, connectionParams).then(() => {
  console.info("Connected To MongoDB Atlas")
}).catch((e)=>{
  console.log("Error: ", e);
})

const userSchema =  mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true
  },
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
