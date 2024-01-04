const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, homeController.loadHome);

module.exports = router;