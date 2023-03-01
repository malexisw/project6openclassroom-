const mongoose = require("mongoose");
let Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

let UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => {
      // Create a regex for email adresses
      const pattern = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
      return pattern.test(email);
    },
    message: (props) => `${props.value} is not in correct format !!`,
  },
  password: {
    type: String,
    required: true,
    validate: (password) => {
      // Create a regex for password that need to have at least 1 lowercase/1 uppercase
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])/i;
      return pattern.test(password);
    },
    message: (props) => `${props.value} is not in correct format !!`,
  },
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;
