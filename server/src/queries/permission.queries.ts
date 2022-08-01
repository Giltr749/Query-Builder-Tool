export const PermissionQueries = {
  GetPermissions: `
    SELECT
      permission_id,
      permission_name
    FROM permissions 
    `,

  GetPermissionNameById: `
    SELECT
      permission_id,
      permission_name
    FROM permissions 
    WHERE permission_id = ?
    `,

  GetPermissionById: `
    SELECT
        user_id,
        permission_id
    FROM hasPermission
    WHERE
        user_id = ?
`,

  GetPermissionByUserMail: ` 
    SELECT permission_name
    FROM users
    JOIN hasPermission ON users.user_id=hasPermission.user_id
    JOIN permissions ON hasPermission.permission_id=permissions.permission_id
    WHERE email = ?
  `,

  GetPermissionByUserId: ` 
    SELECT permissions.permission_id, permissions.permission_name
    FROM users
    JOIN hasPermission ON users.user_id=hasPermission.user_id
    JOIN permissions ON hasPermission.permission_id=permissions.permission_id
    WHERE users.user_id = ?
  `,

  SetPermissionsById: `
    UPDATE hasPermission
    SET
      permission_id = ?
    WHERE
      user_id = ?
`
  ,
  AddUserPermission: `
  INSERT IGNORE INTO hasPermission (user_id, permission_id)
  VALUES (?, ?);
`,

  DeleteUserPermission: `
  DELETE FROM hasPermission
  WHERE user_id = ? AND permission_id = ?

`,

  SetPermissions: `
  SELECT *
  FROM hasPermission
    `
  ,
  ChangePermissions: `
    UPDATE permissions
    SET permission_name = ?
    WHERE permission_id = ?
    `
};
