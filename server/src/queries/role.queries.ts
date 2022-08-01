export const RoleQueries = {
  GetRoles: `
      SELECT
        role_id,
        role_name
      FROM roles 
`
  ,
  GetRoleById: `
    SELECT
        user_id,
        role_id
    FROM hasRole as r
    WHERE
        user_id = ?
`,

  GetRoleByEmail: `
SELECT 
users.user_id,
role_id
FROM users 
JOIN hasRole ON users.user_id=hasRole.user_id
WHERE email = ?
`
  ,
  GetRoleNameById: `
  SELECT
      role_id,
      role_name
  FROM roles
  WHERE
      role_id = ?
`
  ,
  SetRoleById: `
UPDATE hasRole
SET
    role_id = ?
WHERE
    user_id = ?
`,
  AddUserRole: `
INSERT INTO hasRole (user_id, role_id)
VALUES (?, ?);
`
};
