CREATE DATABASE user_system;

CREATE TABLE user_system.users (
user_id int NOT NULL AUTO_INCREMENT,
email VARCHAR(45) NOT NULL,
password VARCHAR(200),
provider_id VARCHAR(45) NOT NULL,
secret VARCHAR(200),
user_status int NOT NULL,
PRIMARY KEY (user_id)
);

CREATE TABLE user_system.roles (
role_id int NOT NULL,
role_name varchar(45) NOT NULL,
PRIMARY KEY(role_id)
);

CREATE TABLE user_system.hasRole (
user_id int NOT NULL,
role_id int NOT NULL,
PRIMARY KEY(user_id, role_id)
);

CREATE TABLE user_system.permissions (
permission_id int NOT NULL,
permission_name varchar(45) NOT NULL,
PRIMARY KEY(permission_id)
);

CREATE TABLE user_system.hasPermission (
user_id int NOT NULL,
permission_id int NOT NULL,
PRIMARY KEY(user_id, permission_id)
);