import { Response, NextFunction } from "express";
import { addUserPermissions } from "../../services/permission.service";
import { addUserRole } from "../../services/role.service";
import { getUserByEmail, registerNewUser } from "../../services/user.service";
const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;
const bcrypt = require('bcrypt');

export async function registerUser(req, res: Response, next: NextFunction) {
    await getUserByEmail(req.body.email).then(user => {
        user = user[0];
        if (user) {
            req.session.messages = { registrationPage: "E-Mail is already registered." };
            return next();
        }
        else if (req.body.password.localeCompare(req.body.password_conf)) {
            req.session.messages = { registrationPage: "Passwords don't match." };
            return next();
        } else {
            req.session.messages = null;
            bcrypt.hash(req.body.password, 10).then(
                (hash: string) => {
                    const google_auth = GoogleAuthenticator.register(req.body.email);
                    registerNewUser(req.body.email, hash, 'adk', google_auth.secret, 0).then(res => {
                        addUserRole(res.insertId, 0);
                    })
                    res.locals.google_auth = google_auth;
                    return next();
                }
            );
        }
    });
}
