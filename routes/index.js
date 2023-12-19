var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require("./multer");
const { default: mongoose } = require('mongoose');

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/profile")
  }
  res.render('index', { error: req.flash('error') });
});

router.get("/show/posts/:postid", async function (req, res) {
  const postid = req.params.postid;
  try {
    const post = await postModel.findById(postid);
    if (post) {
      const postObject = post.toObject();
      res.render("apnapostdekho", { postObject });
    } else {
      console.log('Post not found');
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

router.post('/fileupload', isLoggedIn, upload.single("image"), async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

router.get('/profile', isLoggedIn, async function (req, res) {
  const user =
    await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts")
  res.render("profile", { user });
});

router.get('/show/posts', isLoggedIn, async function (req, res) {
  const user =
    await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts")
  res.render("show", { user });
});

router.get('/feed', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const posts = await postModel.find().limit(100)
    .populate("user")
  res.render("feed", { user, posts })
});

router.get('/feed/:postid', async function (req, res) {
  const postid = req.params.postid;
  try {
    const post = await postModel.findById(postid);
    if (post) {
      const postObject = post.toObject();
      const userid = postObject.user;
      try {
        const user = await userModel.findById(userid);
        if (user) {
          const userObject = user.toObject();
          res.render("singlepost", { postObject, userObject })
        } else {
        }
      } catch (error) {
        console.error(error);
      }
      // res.render("singlepost", { postObject })
    } else {
      console.log('Post not found');
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/register', function (req, res) {
  let userIfFail = req.flash("usernameError");
  res.render('register', { userIfFail });
});

router.get('/add', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render("add", { user });
});

router.post('/createpost', isLoggedIn, upload.single("postimage"), async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post('/register', function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, name: fullname });
  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    }).catch(()=>{
      req.flash("usernameError", "Username already taken!");
      res.redirect("/register");
    })
});

router.post('/login', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile",
  failureFlash: true
}), function (req, res) {
});

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect("/");
  })
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
