import { BorrowRecord } from '../types'

export const borrowings: BorrowRecord[] = [
  {
    id: 1,
    userId: 2,
    bookId: 1,
    borrowDate: '2023-10-15',
    returnDate: null,
    status: 'active'
  },
  {
    id: 2,
    userId: 2,
    bookId: 3,
    borrowDate: '2023-10-20',
    returnDate: null,
    status: 'active'
  },
  {
    id: 3,
    userId: 3,
    bookId: 5,
    borrowDate: '2023-10-10',
    returnDate: null,
    status: 'overdue'
  },
  {
    id: 4,
    userId: 2,
    bookId: 4,
    borrowDate: '2023-09-01',
    returnDate: '2023-09-20',
    status: 'returned'
  }
]

export default borrowings