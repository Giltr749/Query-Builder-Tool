import { Response, NextFunction } from "express";
import { getRoleByEmail } from "../../services/role.service";

const request = require('request');

export function logout(req, res: Response, next: NextFunction) {
    req.logout(function (err) {
        if (err) { return next(err); } else {
            res.redirect('/login');
        }
    });
}

export function checkAuthenticated(req, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

export function checkNotAuthenticated(req, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        return next();
    }
}

export function isAuthenticatedAdmin(req, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        getRoleByEmail(req.session.passport.user).then(role => {
            if (role[0].role_id === 1) {
                return next();
            } else {
                req.session.messages = { errorPage: "You do not have access to this page." };
                res.redirect('/administration/error');
            }
        });
    } else {
        req.session.messages = { errorPage: "You do not have access to this page." };
        res.redirect('/error');
    }
}

export function captchaVerification(req, res: Response, next: NextFunction) {
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        req.session.messages = { errorPage: "Something went wrong with Captcha." };
        return res.redirect('/administration/error');
    }
    const secretKey = process.env.reCAPTCHA_SECRETKEY;
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationURL, function (error, response, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            req.session.messages = { errorPage: "Failed Captcha Verification." };
            return res.redirect('/administration/error');
        }
        next();
    });
}


