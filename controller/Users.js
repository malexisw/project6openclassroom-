const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const { tokenConfig } = require("../config");

// Function to signup
exports.signup = (req, res) => {
  // Hashing the password and create the new User
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    // Saving the new user in the database
    user
      .save()
      .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
      .catch((err) => res.status(500).json({ err }));
  });
};

// Function to login
exports.login = (req, res) => {
  // Find the user with his email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      // Compare the 2 hashing of the password
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          // Create an unique token for the user
          const token = jwt.sign({ userId: user._id }, tokenConfig, {
            expiresIn: "24h",
          });
          res.status(200).json({
            userId: user._id,
            token: token,
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
