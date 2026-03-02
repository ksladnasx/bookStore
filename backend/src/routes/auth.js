import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {}
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }
    const [rows] = await pool.query(
      'SELECT id, username, password, name, role, email FROM readers WHERE username = ? AND password = ?',
      [username, password]
    )
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    const user = rows[0]
    const [borrowRows] = await pool.query(
      'SELECT book_id FROM borrowrecords WHERE reader_id = ? AND return_date IS NULL AND status = "active"',
      [user.id]
    )
    const borrowedBooks = borrowRows.map((r) => r.book_id)
    const { password: _, ...safe } = user
    res.json({ user: { ...safe, password: '', borrowedBooks } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/logout', (req, res) => {
  res.json({ message: 'ok' })
})

router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email } = req.body || {}
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }
    if (String(username).length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' })
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }
    const [existing] = await pool.query('SELECT id FROM readers WHERE username = ?', [username])
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username already exists' })
    }
    const displayName = name && String(name).trim() ? String(name).trim() : String(username)
    const userEmail = email && String(email).trim() ? String(email).trim() : `${username}@local`
    await pool.query(
      'INSERT INTO readers (username, password, name, role, email) VALUES (?, ?, ?, "user", ?)',
      [username, password, displayName, userEmail]
    )
    res.status(201).json({ message: 'Registration successful' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
