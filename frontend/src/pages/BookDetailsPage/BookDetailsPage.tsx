// src/pages/BookDetailsPage/BookDetailsPage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Heart } from "lucide-react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
// @ts-ignore
import axiosInstance from "../../utils/axiosInstance";

import "./BookDetailsPage.css";

type UserRole = "Reader" | "Librarian" | null;

interface Book {
    id: string | number;
    name: string;
    author: string;
    year?: number;
    coverUrl?: string;
    reservedCount?: number;
    totalCount?: number;
    description?: string;
}

interface LocationState {
    book?: Book;
}

interface RouteParams {
    [key: string]: string | undefined;
    id?: string;
}


const BookDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<RouteParams>();

    const locationState = location.state as LocationState | null;

    const [book, setBook] = useState<Book | null>(locationState?.book ?? null);

    const [userRole, setUserRole] = useState<UserRole>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // читаем роль и токен
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const token = localStorage.getItem("access_token");
        const role = (localStorage.getItem("user_role") as UserRole) || null;

        setIsAuthorized(!!token);
        setUserRole(role);
    }, []);

    const isReader = isAuthorized && userRole === "Reader";

    // если пришли по прямой ссылке без state – тянем книгу с бэка
    useEffect(() => {
        const fetchBook = async () => {
            if (book !== null) {
                return;
            }

            if (!id) {
                return;
            }

            try {
                const response = await axiosInstance.get(`books/${id}`);
                const b = response.data;

                const mapped: Book = {
                    id: b.id ?? b.Id,
                    name: b.name ?? b.Name,
                    author: b.author ?? b.Author,
                    year: b.publishedYear ?? b.PublishedYear,
                    coverUrl: b.imgPath ?? b.ImgPath ?? undefined,
                    description: b.description ?? b.Description ?? undefined,
                };

                setBook(mapped);
            } catch (error) {
                console.error("Ошибка при загрузке книги:", error);
            }
        };

        fetchBook();
    }, [id, book]);

    // подтягиваем избранное из localStorage для этой книги
    useEffect(() => {
        if (!book || typeof window === "undefined") {
            return;
        }

        const raw = localStorage.getItem("favorite_book_ids");
        if (!raw) {
            setIsFavorite(false);
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                setIsFavorite(parsed.includes(book.id));
            } else {
                setIsFavorite(false);
            }
        } catch {
            setIsFavorite(false);
        }
    }, [book]);

    const toggleFavorite = async () => {
        if (!book || typeof window === "undefined") {
            return;
        }

        if (!isReader) {
            return;
        }

        let ids: (string | number)[] = [];
        const raw = localStorage.getItem("favorite_book_ids");

        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    ids = parsed;
                }
            } catch {
                ids = [];
            }
        }

        try {
            if (ids.includes(book.id)) {
                await axiosInstance.delete(`books/${book.id}/favorite`);
                ids = ids.filter((x) => x !== book.id);
                setIsFavorite(false);
            } else {
                await axiosInstance.post(`books/${book.id}/favorite`);
                ids = [...ids, book.id];
                setIsFavorite(true);
            }

            localStorage.setItem("favorite_book_ids", JSON.stringify(ids));
        } catch (error) {
            console.error("Ошибка при изменении избранного:", error);
        }
    };

    const handleReserve = async () => {
        if (!book) {
            return;
        }

        if (!isReader) {
            return;
        }

        try {
            // простой пример: бронь на 7 дней вперёд
            const now = new Date();
            const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

            await axiosInstance.post(`books/${book.id}/booking`, {
                bookingEnd: end.toISOString(),
            });

            // сюда можно добавить уведомление пользователю об успешной брони
        } catch (error) {
            console.error("Ошибка при бронировании книги:", error);
        }
    };

    if (!book) {
        return (
            <>
                <Header />
                <main className="book-details-container">
                    <h2>Книга не найдена</h2>
                    <button onClick={() => navigate(-1)}>Вернуться назад</button>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="book-details-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Назад к каталогу
                </button>

                <div className="book-details-content">
                    <div className="book-details-image-wrapper">
                        {isReader && (
                            <button
                                type="button"
                                className={`book-favorite-btn ${
                                    isFavorite ? "book-favorite-btn--active" : ""
                                }`}
                                onClick={toggleFavorite}
                                aria-label={
                                    isFavorite
                                        ? "Убрать книгу из избранного"
                                        : "Добавить книгу в избранное"
                                }
                            >
                                <Heart size={18} />
                            </button>
                        )}

                        {book.coverUrl ? (
                            <img
                                src={book.coverUrl}
                                alt={book.name}
                                className="book-details-cover"
                            />
                        ) : (
                            <div className="book-details-placeholder">
                                {book.name[0]}
                            </div>
                        )}
                    </div>

                    <div className="book-details-info">
                        <h1 className="book-details-title">{book.name}</h1>
                        <p className="book-details-author">
                            Автор: <span>{book.author}</span>
                        </p>
                        {book.year && (
                            <p className="book-details-year">
                                Год издания: {book.year}
                            </p>
                        )}

                        <div className="book-details-description">
                            <h3>Описание</h3>
                            <p>
                                {book.description
                                    ? book.description
                                    : `Здесь должно быть описание книги. Так как мы используем моковые данные, представьте здесь увлекательную аннотацию к произведению "${book.name}", которая побудит читателя взять эту книгу в библиотеке.`}
                            </p>
                        </div>

                        {isReader && (
                            <button
                                type="button"
                                className="booking-button"
                                onClick={handleReserve}
                            >
                                Забронировать книгу
                            </button>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default BookDetailsPage;
