import { User } from '../types'

export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@library.com',
    borrowedBooks: []
  },
  {
    id: 2,
    username: 'user1',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    email: 'john@example.com',
    borrowedBooks: [1, 3]
  },
  {
    id: 3,
    username: 'doctor@126.com',
    password: 'password',
    name: 'Jane Smith',
    role: 'user',
    email: 'jane@example.com',
    borrowedBooks: [5]
  },
  {
    id: 4,
    username: 'wanghan46',
    password: 'aaaaaa',
    name: 'Admin User Wang',
    role: 'admin',
    email: 'admin@library.com',
    borrowedBooks: []
  }
]

export default users