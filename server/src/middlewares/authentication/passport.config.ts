import { IUser } from "../../models/users.model";
import { addUserRole } from "../../services/role.service";
import { getUserByEmail, getUserByProviderId, registerNewUser } from "../../services/user.service";

const GoogleStrategy = require('passport-google-oidc');
const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;
const TwoFAStrategy = require('passport-2fa-totp').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport) {
    const authenticateGoogleUser = async (issuer, profile, done) => {
        try {
            await getUserByProviderId(profile.id).then(user => {
                if (user[0]) {
                    user = user[0];
                    if (user) {
                        if (user.user_status === 0) {
                            return done(null, false, { message: 'Your account is pending approval.' });
                        }
                        else if (user.user_status === 2) {
                            return done(null, false, { message: 'Your account is deactivated.' });
                        } else {
                            return done(null, user);
                        }
                    } else {
                        return done(null, false, { message: 'No registered Google account with this e-mail.' });
                    }
                } else {
                    getUserByEmail(profile.emails[0].value).then(user => {
                        if (user[0]) {
                            return done(null, false, { message: 'This email adress is already linked to an AD Knight Account.' });
                        } else {
                            registerNewUser(profile.emails[0].value, null, profile.id, null, 0).then(res => {
                                addUserRole(res.insertId, 0);
                                return done(null, false, { message: 'Your account is pending approval.' });
                            });
                        }
                    });
                }
            });
        } catch (e) {
            return done(e)
        }
    }

    const credential_authentication = async function (email, password, done) {
        await getUserByEmail(email).then(async res => {
            const user = res[0];
            if (!user) {
                return done(null, false, { message: 'No user with that email.' });
            } else {
                if (user.provider_id.localeCompare("adk") === 0) {
                    if (user.user_status === 0) {
                        return done(null, false, { message: 'Your account is pending approval.' });
                    } else if (user.user_status === 2) {
                        return done(null, false, { message: 'Your account is deactivated.' })
                    } else if (await bcrypt.compare(password, user.password)) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Password incorrect.' })
                    }
                } else {
                    return done(null, false, { message: 'This E-Mail is registered with a Google Account. Please login with Google.' })
                }

            }
        });
    }

    const totp_authentication = function (user, done) {
        if (!user.secret) {
            done(new Error("Google Authenticator is not setup yet."));
        } else {
            var secret = GoogleAuthenticator.decodeSecret(user.secret);
            done(null, secret, 30);
        }
    }

    passport.use(new TwoFAStrategy({
        usernameField: 'email',
        passwordField: 'password',
        codeField: 'code'
    }, credential_authentication, totp_authentication));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.URL
    }, authenticateGoogleUser));

    passport.serializeUser((user: IUser, done) => done(null, user.email));
    passport.deserializeUser((email: string, done) => { return done(null, getUserByEmail(email)) });
}

module.exports = initialize;