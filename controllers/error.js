const User = require("../models/User");module.exports = {

    load404: async (req, res) => {
        try {
            if (req.user) {
                return res.status(404).render("error.ejs", { user: req.user });
            }
            res.redirect("/");
        } catch(err) {
            console.log(err);
        }
    }
}