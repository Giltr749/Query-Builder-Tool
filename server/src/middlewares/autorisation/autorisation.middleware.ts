import { NextFunction } from "express";
import { getPermissionNamesByUserEmail } from "../../services/permission.service";

export function hasAutorisation(req: any, res: Response, next: NextFunction) {
    let userPermissions = [];

    getPermissionNamesByUserEmail(req.session.passport.user).then(perm => {
        for (const permission of perm) {
            userPermissions.push(permission.permission_name)
        }
        //exchange cluster_id
        if (userPermissions.includes(req.query.cluster_id)) {
            next();
        }
    });
}