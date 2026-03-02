-- Run this in MySQL as a user with CREATE DATABASE permission first, or ensure librarydb exists.
-- CREATE DATABASE IF NOT EXISTS librarydb;
-- USE librarydb;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(128) NOT NULL DEFAULT '',
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  email VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(128) NOT NULL DEFAULT '',
  isbn VARCHAR(32) NOT NULL DEFAULT '',
  publish_year INT NOT NULL DEFAULT 0,
  category VARCHAR(64) NOT NULL DEFAULT '',
  description TEXT,
  cover_image VARCHAR(512) NOT NULL DEFAULT '',
  quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS borrowings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  return_date DATE NULL,
  status ENUM('active', 'returned', 'overdue') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  INDEX idx_borrowings_user (user_id),
  INDEX idx_borrowings_book (book_id),
  INDEX idx_borrowings_status (status)
);
