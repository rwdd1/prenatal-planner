module.exports = {
    loadIndex: (req, res) => {
        if (req.user) return res.redirect("/home");
        res.render("index.ejs");
    }
}