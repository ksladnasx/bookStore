import { Book } from '../types'

export const books: Book[] = [
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0061120084',
    publishYear: 1960,
    category: 'Fiction',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    coverImage: 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: false,
    quantity: 3,
    borrowedBy: [2]
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    publishYear: 1949,
    category: 'Fiction',
    description: 'A dystopian novel set in Airstrip One, a province of the superstate Oceania in a world of perpetual war, omnipresent government surveillance, and public manipulation.',
    coverImage: 'https://images.pexels.com/photos/3826686/pexels-photo-3826686.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
    quantity: 2,
    borrowedBy: []
  },
  {
    id: 3,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    publishYear: 1925,
    category: 'Classic',
    description: 'A novel of triumph and tragedy, noted for the remarkable way Fitzgerald captured a cross-section of American society.',
    coverImage: 'https://images.pexels.com/photos/2465877/pexels-photo-2465877.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: false,
    quantity: 1,
    borrowedBy: [2]
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0141439518',
    publishYear: 1813,
    category: 'Romance',
    description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet.',
    coverImage: 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
    quantity: 2,
    borrowedBy: []
  },
  {
    id: 5,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '978-0547928227',
    publishYear: 1937,
    category: 'Fantasy',
    description: 'A fantasy novel set in Middle-earth following the quest of Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon.',
    coverImage: 'https://images.pexels.com/photos/2386687/pexels-photo-2386687.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: false,
    quantity: 3,
    borrowedBy: [3]
  },
  {
    id: 6,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0316769488',
    publishYear: 1951,
    category: 'Fiction',
    description: 'A controversial novel originally published for adults, it has since become popular with adolescents for its themes of teenage angst and alienation.',
    coverImage: 'https://images.pexels.com/photos/2127790/pexels-photo-2127790.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
    quantity: 2,
    borrowedBy: []
  },
  {
    id: 7,
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    isbn: '978-0618640157',
    publishYear: 1954,
    category: 'Fantasy',
    description: 'An epic high-fantasy novel set in Middle-earth, the world at some distant time in the past.',
    coverImage: 'https://images.pexels.com/photos/1738805/pexels-photo-1738805.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
    quantity: 4,
    borrowedBy: []
  },
  {
    id: 8,
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    isbn: '978-0747532699',
    publishYear: 1997,
    category: 'Fantasy',
    description: 'The first novel in the Harry Potter series follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday.',
    coverImage: 'https://images.pexels.com/photos/3388671/pexels-photo-3388671.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
    quantity: 5,
    borrowedBy: []
  }
]

export default books