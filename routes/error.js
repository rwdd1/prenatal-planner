const express = require("express");
const router = express.Router();
const errorController = require("../controllers/error");
const { ensureAuth } = require("../middleware/auth");

router.all("*", ensureAuth, errorController.load404);

module.exports = router;