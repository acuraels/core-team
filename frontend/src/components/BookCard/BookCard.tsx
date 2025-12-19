import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import "./BookCard.css";

interface Book {
  id: string | number;
  name: string;
  author: string;
  year?: number;
  coverUrl?: string;
  reservedCount?: number; // для библиотекаря
  totalCount?: number;    // для библиотекаря
}

type BookCardMode = "public" | "reader" | "librarian";

interface BookCardProps {
  book: Book;
  mode?: BookCardMode;
  // для читателя
  showFavorite?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  mode = "public",
  showFavorite = false,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  const handleFavoriteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite?.();
  };

  return (
    <div className="book-card" onClick={handleClick}>
      {showFavorite && (
        <button
          type="button"
          className={`book-favorite-btn ${isFavorite ? "book-favorite-btn--active" : ""
            }`}
          onClick={handleFavoriteClick}
          aria-label={
            isFavorite ? "Убрать книгу из избранного" : "Добавить книгу в избранное"
          }
        >
          <Heart size={18} />
        </button>
      )}

      {book.coverUrl ? (
        <img src={book.coverUrl} alt={book.name} className="book-cover" />
      ) : (
        <div className="book-cover-placeholder">
          {book.name[0]}
          {book.name.split(" ")[1]?.[0] || ""}
        </div>
      )}

      <div className="book-info">
        <h3 className="book-title">{book.name}</h3>
        <p className="book-author">{book.author}</p>
        {book.year && <p className="book-year">{book.year}</p>}

        {mode === "librarian" && (
          <div className="book-librarian-stats">
            <p className="book-librarian-stat yellow">
              Забронировано: <strong>{book.reservedCount ?? 0}</strong>
            </p>
            <p className="book-librarian-stat green">
              Всего экземпляров: <strong>{book.totalCount ?? 0}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
