export const UserQueries = {
  GetUsers: `
    SELECT
      user_id,
      email,
      password,
      provider_id,
      secret,
      user_status
    FROM users 
    `,

  GetUsersWithRoleAndPermission: `
    SELECT *
    FROM users
    JOIN hasRole ON users.user_id=hasRole.user_id
    JOIN roles ON hasRole.role_id=roles.role_id
    JOIN hasPermission ON users.user_id=hasPermission.user_id
    JOIN permissions ON hasPermission.permission_id=permissions.permission_id
    `,

  GetUsersWithRoleAndPermissionByStatus: `
    SELECT users.user_id, users.email, users.user_status, roles.role_id, roles.role_name, JSON_OBJECTAGG(IFNULL(permissions.permission_name, ''), permissions.permission_id) as permissions
    FROM users
    JOIN hasRole ON users.user_id=hasRole.user_id
    JOIN roles ON hasRole.role_id=roles.role_id
    LEFT JOIN hasPermission ON users.user_id=hasPermission.user_id
    LEFT JOIN permissions ON hasPermission.permission_id=permissions.permission_id
    WHERE users.user_status = ?
    GROUP BY users.user_id
    `,

  GetUsersWithRoleByStatus: `
    SELECT *
    FROM users
    JOIN hasRole ON users.user_id=hasRole.user_id
    JOIN roles ON hasRole.role_id=roles.role_id
    WHERE users.user_status=?
    `,

  GetUserByEmail: `
    SELECT
      user_id,
      email,
      password,
      provider_id,
      secret,
      user_status
    FROM users 
    WHERE
      email = ?
    `,

  GetUserById: `
    SELECT
      user_id,
      email,
      password,
      provider_id,
      secret,
      user_status
    FROM users
    WHERE
      user_id = ?
    `,

  GetUserByProviderId: `
    SELECT
      user_id,
      email,
      password,
      provider_id,
      secret,
      user_status
    FROM users
    WHERE
      provider_id = ?
    `,

  GetUserIdByEmail: `
    SELECT
      user_id
    FROM users
    WHERE
      email = ?
    `,

  GetUsersByRole: `
    SELECT
    user_id,
    role_id
    FROM hasRole
    WHERE
      role_id = ?
    `,

  AddUser: `
    INSERT INTO users (email, password, provider_id, secret, user_status)
    VALUES (?, ?, ?, ?, ?);
  `,

  SetUserStatus: `
  UPDATE users
  SET user_status = ?
  WHERE user_id = ?
  `,

  UpdateUserByEmail: `
    UPDATE users
    SET password = ?,
        provider_id = ?
    WHERE
        email = ?
  `,

  DeleteUserByEmail: `
    DELETE FROM users
    WHERE
        email = ?
  `
};
