import { Router } from 'express'
import pool from '../db.js'

const router = Router()

function bookRowToBook(row, borrowedBy = []) {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    isbn: row.isbn,
    publishYear: row.publish_year,
    category: row.category,
    description: row.description || '',
    coverImage: row.cover_image || '',
    quantity: row.quantity,
    borrowedBy,
    available: row.quantity > (row.borrowed_count ?? 0)
  }
}

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, COUNT(br.id) AS borrowed_count
      FROM books b
      LEFT JOIN borrowrecords br ON br.book_id = b.id AND br.return_date IS NULL AND br.status = 'active'
      GROUP BY b.id
    `)
    const [borrowRows] = await pool.query(
      'SELECT book_id, reader_id FROM borrowrecords WHERE return_date IS NULL AND status = "active"'
    )
    const byBook = {}
    for (const r of borrowRows) {
      if (!byBook[r.book_id]) byBook[r.book_id] = []
      byBook[r.book_id].push(r.reader_id)
    }
    const books = rows.map((r) =>
      bookRowToBook(r, byBook[r.id] || [])
    )
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
    const [rows] = await pool.query(
      'SELECT * FROM books WHERE id = ?',
      [id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Book not found' })
    const [borrowRows] = await pool.query(
      'SELECT reader_id FROM borrowrecords WHERE book_id = ? AND return_date IS NULL AND status = "active"',
      [id]
    )
    const borrowedBy = borrowRows.map((r) => r.reader_id)
    const r = rows[0]
    const book = bookRowToBook(
      { ...r, borrowed_count: borrowedBy.length },
      borrowedBy
    )
    res.json(book)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, publishYear, category, description, coverImage, quantity } = req.body || {}
    if (!title || !author || !isbn || publishYear == null || !category || quantity == null) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const [result] = await pool.query(
      `INSERT INTO books (title, author, isbn, publish_year, category, description, cover_image, quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, isbn, parseInt(publishYear, 10), category, description || '', coverImage || '', parseInt(quantity, 10)]
    )
    const id = result.insertId
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id])
    const r = rows[0]
    res.status(201).json(bookRowToBook(r, []))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
    const { title, author, isbn, publishYear, category, description, coverImage, quantity } = req.body || {}
    const updates = []
    const values = []
    if (title !== undefined) { updates.push('title = ?'); values.push(title) }
    if (author !== undefined) { updates.push('author = ?'); values.push(author) }
    if (isbn !== undefined) { updates.push('isbn = ?'); values.push(isbn) }
    if (publishYear !== undefined) { updates.push('publish_year = ?'); values.push(parseInt(publishYear, 10)) }
    if (category !== undefined) { updates.push('category = ?'); values.push(category) }
    if (description !== undefined) { updates.push('description = ?'); values.push(description) }
    if (coverImage !== undefined) { updates.push('cover_image = ?'); values.push(coverImage) }
    if (quantity !== undefined) { updates.push('quantity = ?'); values.push(parseInt(quantity, 10)) }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' })
    values.push(id)
    await pool.query(`UPDATE books SET ${updates.join(', ')} WHERE id = ?`, values)
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Book not found' })
    const [borrowRows] = await pool.query(
      'SELECT reader_id FROM borrowrecords WHERE book_id = ? AND return_date IS NULL AND status = "active"',
      [id]
    )
    const borrowedBy = borrowRows.map((r) => r.reader_id)
    res.json(bookRowToBook({ ...rows[0], borrowed_count: borrowedBy.length }, borrowedBy))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
    const [active] = await pool.query(
      'SELECT id FROM borrowrecords WHERE book_id = ? AND (return_date IS NULL OR status = "active")',
      [id]
    )
    if (active.length > 0) {
      return res.status(400).json({ error: 'Cannot delete book with active borrowings' })
    }
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Book not found' })
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
