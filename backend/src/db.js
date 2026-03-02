import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'librarydb_user',
  password: process.env.DB_PASSWORD || '111111',
  database: process.env.DB_DATABASE || 'librarydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export default pool
