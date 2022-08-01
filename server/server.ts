import { NextFunction, Response } from "express";
import { captchaVerification, checkAuthenticated, checkNotAuthenticated, logout } from "./src/middlewares/authentication/authentication.middleware";
import { registerUser } from "./src/middlewares/registration/registration.middleware";
import { morganMiddleware } from "./src/middlewares/logger/morgan";
import Logger from "./src/middlewares/logger/winston";

require('dotenv').config()
const express = require('express');

const app = express();
const cors = require('cors');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const initPassport = require('./src/middlewares/authentication/passport.config');
const MySQLConnector = require('./src/utils/mysql.connector');
const bodyParser = require('body-parser');
const app_routes = require('./src/routes/app.routes');
const administration_routes = require('./src/routes/administration.routes');
const path = require('path');

//create database pool
MySQLConnector.init();

initPassport(
    passport
);

app.set('view-engine', 'ejs');
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morganMiddleware);

app.get('/', checkAuthenticated, (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "build", "index.html"));
});

app.use('/app', app_routes);
app.use('/administration', administration_routes);

//careful: position is important
app.use(express.static('build'));
app.use(express.static('public'));

app.get('/login', checkNotAuthenticated, (req, res) => {
    req.session.messages = null;
    res.render('login.ejs', { captcha: res.recaptcha })
});

app.get('/login/google', checkNotAuthenticated, passport.authenticate('google', {
    scope: ['email'],
    prompt: 'select_account'
}));

app.get('/googleredirect', checkNotAuthenticated, passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
    function (req: Request, res: Response) {
        res.redirect('/');
    });

app.get('/register-adknight', checkNotAuthenticated, (req, res: Response, next: NextFunction) => {
    let failureMessage = null;
    if (req.session.messages && !req.session.messages.errorPage) {
        failureMessage = req.session.messages.registrationPage;
    }
    res.render('registeradknight.ejs', { message: failureMessage });
});

app.post('/login', captchaVerification, passport.authenticate('2fa-totp', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post('/register', captchaVerification, registerUser, (req, res: Response, next: NextFunction) => {
    if (req.session.messages) {
        res.redirect("/register-adknight");
    } else {
        res.render('success.ejs', { google_auth: res.locals.google_auth });
    }
});

app.post('/logout', logout, (req: Request, res: Response, next: NextFunction) => { });

app.get('*', function (req: Request, res: Response) {
    res.redirect('/login');
});

app.listen(process.env.PORT, () => {
    return Logger.debug(`Express is listening at ${process.env.HOST}${process.env.PORT}`);
});