import './BookCard.css';

interface Book {
  id: string | number;
  name: string;
  author: string;
  year?: number;
  coverUrl?: string;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="book-card">
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={book.name} className="book-cover" />
      ) : (
        <div className="book-cover-placeholder">Нет обложки</div>
      )}
      
      <div className="book-info">
        <h3 className="book-title">{book.name}</h3>
        <p className="book-author">{book.author}</p>
        {book.year && <p className="book-year">{book.year}</p>}
      </div>
    </div>
  );
};

export default BookCard;