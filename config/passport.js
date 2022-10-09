const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "SECRET",
    },
    function (jwt_payload, done) {
      User.findById(jwt_payload.sub).exec((err, user) => {
        if (err) return done(err, false);

        if (!user) return done(null, false);

        return done(null, user);
      });
    }
  )
);
