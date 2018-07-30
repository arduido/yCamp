const express = require('express'),
      app     = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      Campground = require('./models/campground'),
      Comment = require('./models/comment'),
      User    = require('./models/user'),
      seed    = require('./seeds')

mongoose.connect('mongodb://localhost/campgrounds_v6');
var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log("now connected to the campgrounds db");
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seed();

//passport config

app.use(require("express-session")({
  secret: "One flew over the coco puffs",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/", function(req, res){
  res.render("landing")
});

app.get("/campgrounds", function(req, res){ //this returns the collection of campgrounds
  Campground.find({},function(err, allCampgrounds){
    if (err) {
      console.log("unable to get all campgrounds");
    }else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  })
});
app.get("/campgrounds/new", function(req, res){ //this shows the form for creating new grounds
  res.render("campgrounds/new.ejs");
});
app.post("/campgrounds", function(req, res){ //builds the camp ground object and pushes onto the array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description}
  Campground.create(newCampground, function(err, newsite){
    if (err) {
      console.log('no new site added to db');
    }else {
      res.redirect("campgrounds/index")
    }
  })
});

app.get("/campgrounds/:id", function(req, res){ //this must be the bottom most route because it takes any solid string after campgrounds.
  Campground.findById(req.params.id).populate('comments').exec( function(err, foundsite){
    if (err) {
      console.log("no campground found");
    }else {
      res.render("campgrounds/show", {campground:foundsite});
    }
  });

});
//Comments routes
app.get("/campgrounds/:id/comments/new", function(req, res){
  Campground.findById(req.params.id, function (err, campground){
    if (err) {
      console.log(err);
    }else {
      res.render("comments/new", {campground: campground})
    }
  })
});
app.post("/campgrounds/:id/comments", function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    }else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        }else{
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/"+campground._id);
        }
      });
    }
  });
});

app.get("/register", function(req, res){
    res.render("register");
});
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password)
});
app.listen(3000, console.log('camping app running on port 3000'));
