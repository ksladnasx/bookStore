-- librarydb 数据库表结构（由 librarydb_user 在 librarydb 下执行）
-- 若需重建表，先执行下方 DROP（谨慎：会清空数据）
DROP TABLE IF EXISTS borrowrecords;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS readers;

-- 读者表（对应用户）
CREATE TABLE readers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(128) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  email VARCHAR(128) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 书籍表
CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(256) NOT NULL,
  author VARCHAR(128) NOT NULL,
  isbn VARCHAR(32) NOT NULL,
  publish_year INT NOT NULL,
  category VARCHAR(64) NOT NULL,
  description TEXT,
  cover_image VARCHAR(512) DEFAULT '',
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 借阅记录表
CREATE TABLE borrowrecords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reader_id INT NOT NULL,
  book_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  return_date DATE NULL,
  status ENUM('active', 'returned', 'overdue') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reader_id) REFERENCES readers(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 预约表（预留）
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reader_id INT NOT NULL,
  book_id INT NOT NULL,
  reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'fulfilled', 'cancelled') NOT NULL DEFAULT 'pending',
  FOREIGN KEY (reader_id) REFERENCES readers(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
