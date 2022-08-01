import { execute } from "../utils/mysql.connector";
import { PermissionQueries } from "../queries/permission.queries";
import { IPermission, IUserPermission } from "../models/permission.model";

export const getPermissionById = async (id: number) => {
  return execute<IUserPermission>(PermissionQueries.GetPermissionById, [id]);
};
export const getPermissions = async () => {
  return execute<[IPermission]>(PermissionQueries.GetPermissions, []);
};
export const getPermissionNameById = async (id: number) => {
  return execute<IPermission>(PermissionQueries.GetPermissionNameById, [id]);
};
export const getPermissionNamesByUserEmail = async (email: string) => {
  return execute<[IPermission]>(PermissionQueries.GetPermissionByUserMail, [email]);
};

export const getPermissionsByUserId = async (user_id: number) => {
  return execute<[IPermission]>(PermissionQueries.GetPermissionByUserId, [user_id]);
};

export const setUserPermissions = async (permission_id: IUserPermission['permission_id'], user_id: IUserPermission['user_id']) => {
  return execute<any>(PermissionQueries.SetPermissionsById, [permission_id, user_id]);
};
export const addUserPermissions = async (user_id: IUserPermission['user_id'], permission_id: IUserPermission['permission_id']) => {
  return execute<any>(PermissionQueries.AddUserPermission, [user_id, permission_id]);
};

export const deleteUserPermission = async (user_id: IUserPermission['user_id'], permission_id: IUserPermission['permission_id']) => {
  return execute<any>(PermissionQueries.DeleteUserPermission, [user_id, permission_id]);
};