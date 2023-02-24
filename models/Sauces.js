const mongoose = require("mongoose");
let Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let sauceSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});

sauceSchema.plugin(uniqueValidator);

let Sauces = mongoose.model("Sauces", sauceSchema);

module.exports = Sauces;
