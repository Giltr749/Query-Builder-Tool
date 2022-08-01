import { execute } from "../utils/mysql.connector";
import { UserQueries } from "../queries/user.queries";
import { IUser } from "../models/users.model";
import { IUserRole } from "../models/role.model";

export const getUsers = async () => {
  return execute<IUser[]>(UserQueries.GetUsers, []);
};

export const getUsersWithRoleAndPermission = async () => {
  return execute<IUser[]>(UserQueries.GetUsersWithRoleAndPermission, []);
};

export const getUsersWithRoleAndPermissionByStatus = async (status: number) => {
  return execute<IUser[]>(UserQueries.GetUsersWithRoleAndPermissionByStatus, [status]);
};

export const getUserByEmail = async (email: IUser['email']) => {
  return execute<IUser>(UserQueries.GetUserByEmail, [email]);
};

export const getUserById = async (user_id: IUserRole['user_id']) => {
  return execute<IUser>(UserQueries.GetUserById, [user_id]);
};

export const getUserByProviderId = async (provider_id: IUser['provider_id']) => {
  return execute<IUser>(UserQueries.GetUserByProviderId, [provider_id]);
};

export const getUserIdByEmail = async (email: IUser['email']) => {
  return execute<Number>(UserQueries.GetUserIdByEmail, [email]);
};

export const getUsersByRole = async (user_role: number) => {
  return execute<IUserRole[]>(UserQueries.GetUsersByRole, [user_role]);
};

export const registerNewUser = async (email: IUser['email'], password: IUser['password'], provider_id: IUser['provider_id'], secret: IUser['secret'], user_status: IUser['user_status']) => {
  return execute<any>(UserQueries.AddUser, [email, password, provider_id, secret, user_status]);
};

export const setUserStatus = async (status: IUser['user_status'], user_id: IUser['user_id']) => {
  return execute<any>(UserQueries.SetUserStatus, [status, user_id]);
};

