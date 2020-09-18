const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;

const Customer = require('../models/Customer');

module.exports = {
  loginWithFacebook: async()  => {
    passport.use(new facebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : '2047659992032751',
        clientSecret    : "6e633934308e1f714be9814334271559",
        callbackURL     : "http://localhost:5000/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'email']

    },// facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            Customer.findOne({ 'facebookId' : profile.id }, function(err, customer) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (customer) {
                    console.log("user found")
                    console.log(customer)
                    return customer; // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    const newCustomer = new Customer();

                    // set all of the facebook information in our user model
                    newCustomer.facebookId = profile.id; // set the users facebook id                   
                    //newCustomer.facebookToken = token; // we will save the token that facebook provides to the user                    
                    newCustomer.firstName  = profile.name.givenName;
                    newCustomer.lastname = profile.name.familyName; // look at the passport user profile to see how names are returned
                    newCustomer.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newCustomer.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return { newCustomer, token };
                    });
                }

            });

        })

    }));

  }
}


// import passport from "passport";
// import strategy from 'passport-facebook';
// import Customer from '../models/Customer';
// const FacebookStrategy = strategy.Strategy;

// dotenv.config();
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//       profileFields: ["email", "name"]
//     },
//     function(accessToken, refreshToken, profile, done) {
//       const { email, first_name, last_name } = profile._json;
//       const userData = {
//         email,
//         firstName: first_name,
//         lastName: last_name
//       };
//       new userModel(userData).save();
//       done(null, profile);
//     }
//   )
// );