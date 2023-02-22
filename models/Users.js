const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
