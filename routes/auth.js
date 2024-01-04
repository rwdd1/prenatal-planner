const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { ensureAuth } = require("../middleware/auth");
const passport = require("passport");
const microsoftAuth = passport.authenticate('microsoft', { prompt: 'select_account' });
const microsoftCallback = passport.authenticate('microsoft', { failureRedirect: '/' });

router.get("/microsoft", microsoftAuth);
router.get("/microsoft/callback", microsoftCallback, authController.callback);
router.get("/logout", ensureAuth, authController.logout);

module.exports = router;