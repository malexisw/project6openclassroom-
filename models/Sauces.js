const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let sauceSchema = new Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});

let Sauces = mongoose.model("Sauces", sauceSchema);

module.exports = Sauces;
