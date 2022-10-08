const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

passport.use(
  new localStrategy((username, password, done) => {
    User.findOne({ username }, async (err, user) => {
      if (err) return done(err);

      if (!user) return done(null, false, { message: "User not found" });

      // Call userSchema method to check password
      const validPassword = await user.isValidPassword(password);

      if (!validPassword) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    });
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "SECRET",
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
