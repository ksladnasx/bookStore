import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import booksRoutes from './routes/books.js'
import borrowingsRoutes from './routes/borrowings.js'
import usersRoutes from './routes/users.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/books', booksRoutes)
app.use('/api/borrowings', borrowingsRoutes)
app.use('/api/users', usersRoutes)

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Library API running at http://localhost:${PORT}`)
})
