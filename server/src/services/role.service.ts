import { execute } from "../utils/mysql.connector";
import { RoleQueries } from "../queries/role.queries";
import { IRole, IUserRole } from "../models/role.model";

export const getRoles = async () => {
  return execute<IUserRole>(RoleQueries.GetRoles, []);
};
export const getRoleById = async (id: Number) => {
  return execute<IUserRole>(RoleQueries.GetRoleById, [id]);
};
export const getRoleByEmail = async (email: String) => {
  return execute<IUserRole>(RoleQueries.GetRoleByEmail, [email]);
};
export const getRoleNameById = async (id: Number) => {
  return execute<IRole>(RoleQueries.GetRoleNameById, [id]);
};
export const setUserRole = async (role_id: IUserRole['role_id'], user_id: IUserRole['user_id']) => {
  return execute<any>(RoleQueries.SetRoleById, [role_id, user_id]);
};

export const addUserRole = async (user_id: IUserRole['user_id'], role_id: IUserRole['role_id'],) => {
  return execute<any>(RoleQueries.AddUserRole, [user_id, role_id]);
};