const MicrosoftStrategy = require('passport-microsoft').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {    
    passport.use(new MicrosoftStrategy({
        // Standard OAuth2 options
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/microsoft/callback",
        scope: ['user.read']
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            microsoftId: profile.id,
            email: profile._json.mail,
            forename: profile._json.givenName,
            surname: profile._json.surname,
            jobTitle: profile._json.jobTitle,
            organisation: profile._json.organisation
        }
        try {
            let user = await User.findOne({ microsoftId: newUser.microsoftId });
            if (user) {
                return done(null, user);
            } else {
              if (newUser.jobTitle.toLowerCase() === "midwife" && newUser.organisation.toLowerCase() === "example") {
                user = await User.create(newUser);
                return done(null, user);
              }
              return done(null, false);
            }
        } catch(err) {
            console.log(err);
        }
      }
    ));
    
    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
          return cb(null, {
            id: user.microsoftId,
            forename: user.forename,
            surname: user.surname
          });
        });
      });

    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
}