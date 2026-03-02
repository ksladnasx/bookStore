import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, password, name, role, email FROM readers ORDER BY id'
    )
    const [borrowRows] = await pool.query(
      'SELECT reader_id, book_id FROM borrowrecords WHERE return_date IS NULL AND status = "active"'
    )
    const byUser = {}
    for (const r of borrowRows) {
      if (!byUser[r.reader_id]) byUser[r.reader_id] = []
      byUser[r.reader_id].push(r.book_id)
    }
    const users = rows.map((r) => {
      const { password, ...rest } = r
      return { ...rest, password: '', borrowedBooks: byUser[r.id] || [] }
    })
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
    const { name, email, password } = req.body || {}
    const updates = []
    const values = []
    if (name !== undefined) { updates.push('name = ?'); values.push(name) }
    if (email !== undefined) { updates.push('email = ?'); values.push(email) }
    if (password !== undefined && String(password).trim() !== '') {
      updates.push('password = ?')
      values.push(String(password).trim())
    }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' })
    values.push(id)
    const [result] = await pool.query(`UPDATE readers SET ${updates.join(', ')} WHERE id = ?`, values)
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' })
    const [rows] = await pool.query(
      'SELECT id, username, name, role, email FROM readers WHERE id = ?',
      [id]
    )
    const [borrowRows] = await pool.query(
      'SELECT book_id FROM borrowrecords WHERE reader_id = ? AND return_date IS NULL AND status = "active"',
      [id]
    )
    const borrowedBooks = borrowRows.map((r) => r.book_id)
    res.json({ ...rows[0], password: '', borrowedBooks })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
