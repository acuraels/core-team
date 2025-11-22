import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  return (
    <div className="book-card" onClick={handleClick}>
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={book.name} className="book-cover" />
      ) : (
        <div className="book-cover-placeholder">
            {book.name[0]}{book.name.split(' ')[1]?.[0] || ''}
        </div>
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