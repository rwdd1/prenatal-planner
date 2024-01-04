const User = require("../models/User");

module.exports = {
    loadHome: async (req, res) => {
        try {
            res.render("home.ejs", { user: req.user })
        } catch(err) {
            console.log(err);
        }
    }
}