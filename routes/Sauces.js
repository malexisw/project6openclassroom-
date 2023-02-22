// routes/sauce.js

const express = require("express");
const router = express.Router();
const saucesCtrl = require("../controller/Sauces");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.get("/api/sauces", auth, saucesCtrl.getAllSauces);

router.get("/api/sauces/:id", auth, saucesCtrl.getOneSauces);

router.post("/api/sauces", auth, multer, saucesCtrl.createSauces);

router.post("/api/sauces/:id/like", auth, saucesCtrl.likedSauces);

router.put("/api/sauces/:id", auth, multer, saucesCtrl.updateSauces);

router.delete("/api/sauces/:id", auth, saucesCtrl.deleteSauces);

module.exports = router;
