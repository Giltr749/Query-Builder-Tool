import { NextFunction } from "express";
import { isAuthenticatedAdmin } from "../middlewares/authentication/authentication.middleware";
import { addUserPermissions, deleteUserPermission, getPermissions } from "../services/permission.service";
import { getRoles, setUserRole } from "../services/role.service";
import { getUsersWithRoleAndPermissionByStatus, setUserStatus } from "../services/user.service";

var express = require('express');
var router = express.Router();

router.get('/', isAuthenticatedAdmin, (req: any, res: any, next: NextFunction) => {
    const pendingUsers = getUsersWithRoleAndPermissionByStatus(0);
    const approvedUsers = getUsersWithRoleAndPermissionByStatus(1);
    const inactiveUsers = getUsersWithRoleAndPermissionByStatus(2);
    const permissions = getPermissions();
    const roles = getRoles();

    Promise.all([pendingUsers, approvedUsers, inactiveUsers, permissions, roles]).then(results => {
        results[0].forEach(user => {
            user["permissions"] = JSON.parse(user.permissions);
        });
        results[1].forEach(user => {
            user["permissions"] = JSON.parse(user.permissions);
        });
        results[2].forEach(user => {
            user["permissions"] = JSON.parse(user.permissions);
        });
        res.render('administration.ejs', { pendingUsers: results[0], approvedUsers: results[1], inactiveUsers: results[2], permissions: results[3], roles: results[4] });
    });
});

router.get('/error', (req, res, next: NextFunction) => {
    if (req.session.messages) {
        res.render('error.ejs', { message: req.session.messages.errorPage });
    } else {
        res.redirect("/login");
    }
});

router.post('/', isAuthenticatedAdmin, (req, res, next: NextFunction) => {
    const status = parseInt(req.body.status);
    const role = parseInt(req.body.role);
    const user_id = parseInt(req.body.user_id);

    if (req.body.approveUser) {
        setUserRole(role, user_id);
        setUserStatus(1, user_id);
        getPermissions().then(result => {
            let permissions: { [key: string]: { permission_id: number } } = {};
            result.map(ele => {
                permissions[ele.permission_name] = { permission_id: ele.permission_id }
            })
            if (role !== 1) {
                Object.entries(req.body).forEach(entry => {
                    if (entry[0] in permissions) {
                        addUserPermissions(user_id, permissions[entry[0]].permission_id);
                    }
                });
            } else {
                Object.entries(permissions).forEach(ele => {
                    addUserPermissions(user_id, ele[1].permission_id);
                });
            }
        });
        res.redirect('/administration');
    }
    else if (req.body.status) {
        setUserStatus(status, user_id);
        res.redirect('/administration');
    } else if (req.body.changePermission) {
        getPermissions().then(result => {
            let permissions = {};
            result.map(ele => {
                permissions[ele.permission_name] = { permission_id: ele.permission_id }
            })
            Object.entries(req.body).forEach(entry => {
                if (entry[0] in permissions) {
                    addUserPermissions(user_id, permissions[entry[0]].permission_id);
                    delete permissions[entry[0]];
                }
            });
            Object.entries(permissions).forEach(entry => {
                deleteUserPermission(user_id, permissions[entry[0]].permission_id);
            });
            res.redirect('/administration');
        });
    } else if (req.body.grantFullPermissions) {
        getPermissions().then(result => {
            result.map(ele => {
                addUserPermissions(user_id, ele.permission_id);
            });
        });
        res.redirect('/administration');

    }
    else if (req.body.resetPermissions) {
        getPermissions().then(result => {
            result.map(ele => {
                deleteUserPermission(user_id, ele.permission_id);
            });
            res.redirect('/administration');
        });
    }
    else if (req.body.changeRole) {
        setUserRole(role, user_id);
        if (role === 1) {
            getPermissions().then(result => {
                result.map(ele => {
                    addUserPermissions(user_id, ele.permission_id);
                });
            });
        }
        res.redirect('/administration');
    }
});

module.exports = router;
