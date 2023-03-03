const Sauces = require("../models/Sauces");
const fs = require("fs");

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

// Function to update the sauce in the database
const dataBadeSauceUpdate = (sauce, image, id, res) => {
  //Initialize the sauce updated
  let saucesUpdated = {
    userId: sauce.userId,
    name: sauce.name,
    manufacturer: sauce.manufacturer,
    description: sauce.description,
    mainPepper: sauce.mainPepper,
    heat: sauce.heat,
    usersLiked: sauce.usersLiked,
    usersDisliked: sauce.usersDisliked,
    imageUrl: image ? image : sauce.imageUrl,
  };

  // Update the sauce in the database
  Sauces.updateOne({ _id: id }, saucesUpdated)
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

// Function to check if the updated sauce as an image from multer ro not and call the update function
exports.updateSauces = (req, res) => {
  // Find the sauce to update with the id to see if it exist
  Sauces.findOne({ _id: req.params.id }).then((sauce) => {
    // Get the sauce from the body, if there's an image update we need to do a parse if not we just take the sauce
    let bodyUpdate = new Sauces(
      typeof req.body.sauce === "string" ? JSON.parse(req.body.sauce) : req.body
    );
    // Set the image
    let imageUrlUpdated = undefined;
    req.file
      ? (imageUrlUpdated = `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`)
      : (imageUrlUpdated = sauce.imageUrl);

    //Initialize the sauce updated
    let saucesUpdated = {
      userId: bodyUpdate.userId,
      name: bodyUpdate.name,
      manufacturer: bodyUpdate.manufacturer,
      description: bodyUpdate.description,
      mainPepper: bodyUpdate.mainPepper,
      heat: bodyUpdate.heat,
      usersLiked: bodyUpdate.usersLiked,
      usersDisliked: bodyUpdate.usersDisliked,
    };

    // If the image is updated we delete the old one before
    if (typeof req.body.sauce === "string") {
      const filename = sauce.imageUrl.split("/images/")[1]; // Finding the image's name
      saucesUpdated.imageUrl = imageUrlUpdated;
      fs.unlink(`images/${filename}`, () => {
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
      });
    } else {
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
    }
  });
};

// Function to delete one Sauce
exports.deleteSauces = (req, res) => {
  // Delete the sauce with the id to make sure it exist
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; // Finding the image's name
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id }) // Deleting the image in DB after deleting it from disk
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
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
