module.exports = {
    callback: async (req, res) => {
        try {
            res.redirect(req.session.returnTo || '/home');
        } catch(err) {
            console.log(err);
        }
    },
    logout: async (req, res, next) => {
        req.logout(function(err) {
            if (err) return next(err);
            req.session.destroy((err) => {
                if (err) console.log('Error : Failed to destroy the session during logout.', err);
                req.user = null;
                res.redirect('/');
            })
        });
    }
}