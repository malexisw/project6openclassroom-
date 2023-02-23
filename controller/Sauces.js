const Sauces = require("../models/Sauces");

// Function to get all the sauces
exports.getAllSauces = (req, res) => {
  Sauces.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Function to get one sauce
exports.getOneSauces = (req, res) => {
  Sauces.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      if (sauce) {
        res.status(200).json(sauce);
      } else {
        res.status(400).json({
          message: "No sauces found",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.createSauces = (req, res) => {
  // Initialize the new sauce
  let sauces = new Sauces(JSON.parse(req.body.sauce));
  sauces.dislikes = 0;
  sauces.likes = 0;
  sauces.usersDisliked = [];
  sauces.usersLiked = [];
  sauces.imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;

  // Saving the new sauce in the database
  sauces
    .save()
    .then(() => {
      res.status(200).json({
        message: "Sauce created successfully",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Function to update one Sauce
exports.updateSauces = (req, res) => {
  // Find the sauce to update with the id to see if it exist
  Sauces.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      return res.status(404).json({
        message: "Objet non trouvé !",
      });
    }
    if (sauce.userId !== req.auth.userId) {
      return res.status(401).json({
        message: "Requête non autorisée !",
      });
    }
  });
  // Get the sauce from the body, if there's an image update we need to do a parse if not we just take the sauce
  let sauces = new Sauces(
    typeof req.body.sauce === "string" ? JSON.parse(req.body.sauce) : req.body
  );

  // Set the image
  let imageUrlUpdated = undefined;
  req.file
    ? (imageUrlUpdated = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`)
    : (imageUrlUpdated = sauces.imageUrl);

  //Initialize the sauce updated
  let saucesUpdated = {
    userId: sauces.userId,
    name: sauces.name,
    manufacturer: sauces.manufacturer,
    description: sauces.description,
    mainPepper: sauces.mainPepper,
    heat: sauces.heat,
    usersLiked: sauces.usersLiked,
    usersDisliked: sauces.usersDisliked,
    imageUrl: imageUrlUpdated,
  };

  // Update the sauce in the database
  Sauces.updateOne({ _id: req.params.id }, saucesUpdated)
    .then(() => {
      res.status(201).json({
        message: "Sauce updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Function to delete one Sauce
exports.deleteSauces = (req, res) => {
  // Find the sauce to delete with the id to make sure it exist
  Sauces.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      return res.status(404).json({
        message: "Objet non trouvé !",
      });
    }
    if (sauce.userId !== req.auth.userId) {
      return res.status(401).json({
        message: "Requête non autorisée !",
      });
    }
  });
  // Find the sauce to delete with the id
  Sauces.findByIdAndRemove(req.params.id)
    .then((sauce) => {
      if (sauce) {
        res.status(200).json({
          message: "Sauce deleted successfully",
        });
      } else {
        res.status(400).json({
          message: "No post found",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Function to lide/dislike one Sauce
exports.likedSauces = async (req, res) => {
  // Find the sauce with the id
  Sauces.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      if (sauce) {
        // Get if the user like/dislike or cancel one of them
        const liked = req.body.like;
        // Get if the user id
        const userId = req.body.userId;
        switch (liked) {
          // If user liked
          case 1:
            sauce.likes += 1;
            sauce.usersLiked.push(userId);
            break;
          // If user disliked
          case -1:
            sauce.dislikes += 1;
            sauce.usersDisliked.push(userId);
            break;
          case 0:
            // If user cancel his like/dislike
            const dislikes = sauce.usersDisliked.filter((id) => userId === id);
            dislikes.forEach((value) => (sauce.dislikes -= 1));
            sauce.usersDisliked = sauce.usersDisliked.filter(
              (id) => userId !== id
            );
            const likes = sauce.usersLiked.filter((id) => userId === id);
            likes.forEach((value) => (sauce.likes -= 1));
            sauce.usersLiked = sauce.usersLiked.filter((id) => userId !== id);
            break;
        }
        // Save the sauce with the updated like
        sauce
          .save()
          .then(() => {
            res.status(200).json({
              message: "Sauce's liked updated successfully",
            });
          })
          .catch((error) => {
            res.status(400).json({
              error: error,
            });
          });
      } else {
        res.status(400).json({
          message: "No sauces found",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
