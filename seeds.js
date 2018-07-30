var   mongoose = require('mongoose'),
    Campground = require('./models/campground'),
       Comment = require('./models/comment');

var data = [
  {
    name: "Golden Dome",
    image: "https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439cf1c878a3e5b7_340.jpg",
    description: "This spot has a most perfect placement in the high tundra."
  },
  {
    name: "Milky Way Nights",
    image: "https://pixabay.com/get/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104497f9c070a6e9bdba_340.jpg",
    description: "An amazing stretch of wilderness and perfect night skys."
  },
  {
    name: "Forest Glow",
    image: "https://pixabay.com/get/eb30b70e2cf1043ed1584d05fb1d4e97e07ee3d21cac104497f9c070a6e9bdba_340.jpg",
    description: "The evergreens will glow from your lamp as you take in the night sky"
  },
  {
    name: "Ice Lights",
    image: "https://pixabay.com/get/ea31b10929f7063ed1584d05fb1d4e97e07ee3d21cac104497f9c070a6e9bdba_340.jpg",
    description: "Northern lights campsite in Iceland."
  }
]
function seedDB(){
  Campground.remove({}, function(err){
    if (err) {
      console.log(err);
    }
    console.log("removed campgrounds");
    Comment.remove({}, function(err){
      if (err) {
        console.log(err);
      }
      console.log("comments removed");

      data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
          if (err) {
            console.log(err);
          } else {
            console.log("campground added");

            Comment.create(
              {
                text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                author: "L. Ipsum"
              }, function(err, comment){
                if (err) {
                  console.log(err);
                }else{
                  campground.comments.push(comment);
                  campground.save();
                  console.log("Created new comment");
                }
              }
            )
          }
        })
      })
    })
  })
}
module.exports = seedDB;
