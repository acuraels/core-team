import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import "./BooksPage.css";
import { useEffect, useState } from 'react';
import BookCard from '../../components/BookCard/BookCard';

interface Book {
  id: string | number;
  name: string;
  author: string;
  year?: number;
  coverUrl?: string;
}

const BooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
    const fetchBooks = async () => {
      try {
        const mockBooks: Book[] = [
          {
            id: 1,
            name: "1984",
            author: "Джордж Оруэлл",
            year: 1949,
            coverUrl: '../../../public/fakecover.jpg'
          },
          {
            id: 2,
            name: "Мастер и Маргарита",
            author: "Михаил Булгаков",
            year: 1967,
            coverUrl: '../../../public/fakecover.jpg'
          },
          {
            id: 3,
            name: "Преступление и наказание",
            author: "Фёдор Достоевский",
            year: 1866,
            coverUrl: '../../../public/fakecover.jpg'
          },
          {
            id: 4,
            name: "Преступление и наказание",
            author: "Фёдор Достоевский",
            year: 1866,
            coverUrl: '../../../public/fakecover.jpg'
          },
          {
            id: 5,
            name: "Преступление и наказание",
            author: "Фёдор Достоевский",
            year: 1866,
            coverUrl: '../../../public/fakecover.jpg'
          },
          {
            id: 6,
            name: "Преступление и наказание",
            author: "Фёдор Достоевский",
            year: 1866,
            coverUrl: '../../../public/fakecover.jpg'
          },
          {
            id: 7,
            name: "Преступление и наказание",
            author: "Фёдор Достоевский",
            year: 1866,
            coverUrl: '../../../public/fakecover.jpg'
          },
          {
            id: 8,
            name: "Преступление и наказание",
            author: "Фёдор Достоевский",
            year: 1866,
            coverUrl: '../../../public/fakecover.jpg'
          },
          {
            id: 9,
            name: "Преступление и наказание",
            author: "Фёдор Достоевский",
            year: 1866,
            coverUrl: '../../../public/fakecover.jpg'
          }
        ];

        setTimeout(() => {
          setBooks(mockBooks);
        }, 50);
      } catch (err) {
        console.error("Ошибка при загрузке списка книг:", err);
      }
    };

    fetchBooks();
  }, []);

    return (
        <>
            <Header />
            <main className='books-container'>
                <div className='books-list'>
                    {books.length === 0 ? (
                        <p className='empty-books-list'>К сожалению, в данный момент ни одной книги нет в наличии</p>
                    ) : (
                        books.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                            />
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default BooksPage;
