const Sauces = require("../models/Sauces");

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
  let sauces = new Sauces(JSON.parse(req.body.sauce));
  sauces.dislikes = 0;
  sauces.likes = 0;
  sauces.usersDisliked = [];
  sauces.usersLiked = [];
  sauces.imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
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

exports.updateSauces = (req, res) => {
  let sauces = new Sauces(
    typeof req.body.sauce === "string" ? JSON.parse(req.body.sauce) : req.body
  );

  let imageUrlUpdated = undefined;
  req.file
    ? (imageUrlUpdated = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`)
    : (imageUrlUpdated = sauces.imageUrl);

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

  Sauces.updateOne({ _id: req.params.id }, saucesUpdated)
    .then(() => {
      res.status(201).json({
        message: "Sauce updated seccessfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteSauces = (req, res) => {
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

exports.likedSauces = async (req, res) => {
  Sauces.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      if (sauce) {
        const liked = req.body.like;
        const userId = req.body.userId;
        switch (liked) {
          case 1:
            sauce.likes += 1;
            sauce.usersLiked.push(userId);
            break;
          case -1:
            sauce.dislikes += 1;
            sauce.usersDisliked.push(userId);
            break;
          case 0:
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
