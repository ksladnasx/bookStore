import { Router } from 'express'
import pool from '../db.js'

const router = Router()

function rowToRecord(r) {
  return {
    id: r.id,
    userId: r.reader_id,
    bookId: r.book_id,
    borrowDate: r.borrow_date ? String(r.borrow_date).slice(0, 10) : null,
    returnDate: r.return_date ? String(r.return_date).slice(0, 10) : null,
    status: r.status
  }
}

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId, 10) : null
    let sql = `
      SELECT id, reader_id, book_id, borrow_date, return_date, status
      FROM borrowrecords
    `
    const params = []
    if (userId && !Number.isNaN(userId)) {
      sql += ' WHERE reader_id = ?'
      params.push(userId)
    }
    sql += ' ORDER BY borrow_date DESC'
    const [rows] = await pool.query(sql, params)
    res.json(rows.map(rowToRecord))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { userId, bookId } = req.body || {}
    if (userId == null || bookId == null) {
      return res.status(400).json({ error: 'userId and bookId required' })
    }
    const uid = parseInt(userId, 10)
    const bid = parseInt(bookId, 10)
    if (Number.isNaN(uid) || Number.isNaN(bid)) {
      return res.status(400).json({ error: 'Invalid userId or bookId' })
    }
    const [bookRows] = await pool.query('SELECT id, quantity FROM books WHERE id = ?', [bid])
    if (bookRows.length === 0) return res.status(404).json({ error: 'Book not found' })
    const [activeCount] = await pool.query(
      'SELECT COUNT(*) AS c FROM borrowrecords WHERE book_id = ? AND (return_date IS NULL AND status = "active")',
      [bid]
    )
    const count = activeCount[0].c
    if (count >= bookRows[0].quantity) {
      return res.status(400).json({ error: 'Book not available' })
    }
    const today = new Date().toISOString().slice(0, 10)
    const [result] = await pool.query(
      'INSERT INTO borrowrecords (reader_id, book_id, borrow_date, return_date, status) VALUES (?, ?, ?, NULL, "active")',
      [uid, bid, today]
    )
    const [rows] = await pool.query('SELECT * FROM borrowrecords WHERE id = ?', [result.insertId])
    res.status(201).json(rowToRecord(rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id/return', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
    const [rows] = await pool.query('SELECT * FROM borrowrecords WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Borrow record not found' })
    const rec = rows[0]
    if (rec.status === 'returned') {
      return res.status(400).json({ error: 'Already returned' })
    }
    const today = new Date().toISOString().slice(0, 10)
    await pool.query(
      'UPDATE borrowrecords SET return_date = ?, status = "returned" WHERE id = ?',
      [today, id]
    )
    const [updated] = await pool.query('SELECT * FROM borrowrecords WHERE id = ?', [id])
    res.json(rowToRecord(updated[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
