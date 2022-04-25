const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');
const Admin = require('../models/Admin');

function localStrategy(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
        User.findOne({ where: { email: email } })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'No User Found' });
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        console.log("Passing through User passport...")
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                })
            })
    }));


    // For admin Login

    passport.use('admin', new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
        Admin.findOne({ where: { email: email } })
            .then(admin => {
                if (!admin) {
                    return done(null, false, { message: 'No Admin Found' });
                }
                bcrypt.compare(password, admin.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        console.log("Passing through Admin passport...")
                        return done(null, admin);
                        console.log("Successfully return Admin passport.")
                    } else {
                        return done(null, false, { message: 'Passwordz incorrect' });
                    }
                })
            })
    }));


    passport.serializeUser(function (entity, done) {
        console.log("Test test 1")
        console.log(entity)
        done(null, { id: entity.id, type: entity.type });
        console.log("Test test 2")
        console.log("haha lol xd")
        console.log(entity.id)
        console.log(entity.type)
    });

    passport.deserializeUser(function (obj, done) {
        console.log(obj + "haha")
        console.log(obj.type + "lol")
        switch (obj.type) {
            case 'userzz':
                console.log("Test test got pass a not")
                User.findByPk(obj.id)
                    .then((user) => {
                        console.log("test test deserialize for userzz ")
                        done(null, user); // user object saved in req.session
                    })
                    .catch((done) => { // No user found, not stored in req.session

                        console.log(done);
                    });
                break;
            case 'adminzz':
                Admin.findByPk(obj.id)
                    .then((admin) => {
                        console.log("test test deserialize for adminzz ")
                        done(null, admin); // user object saved in req.session
                        console.log("test test go pass througha  not lOL")
                    })
                    .catch((done) => { // No user found, not stored in req.session

                        console.log(done);
                    });
                break;
            default:
                console.log("TEST TEST TEST TEST WILL IT EVER PASS HERE?!?!?!")
                done(null, admin);
                break;
        }
    });



}
module.exports = { localStrategy };
