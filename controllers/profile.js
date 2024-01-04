const User = require("../models/User");

module.exports = {
    loadProfile: async (req, res) => {
        try {
            const user = await User.findOne({ microsoftId: req.user.id });
            res.render("profile.ejs", { user: user })
        } catch(err) {
            console.log(err);
        }
    }
}