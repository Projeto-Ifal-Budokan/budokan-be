-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `budokan-db`;

-- Use the database
USE `budokan-db`;

-- Grant privileges to budokan user
GRANT ALL PRIVILEGES ON `budokan-db`.* TO 'budokan'@'%'; 