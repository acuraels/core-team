import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BookCard from "../../components/BookCard/BookCard";

import "./BooksPage.css";

type UserRole = "Reader" | "Librarian" | null;

interface Book {
    id: string | number;
    name: string;
    author: string;
    year?: number;
    coverUrl?: string;
    // поля для библиотекаря
    reservedCount?: number;
    totalCount?: number;
}

const BooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [userRole, setUserRole] = useState<UserRole>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    const [favoriteIds, setFavoriteIds] = useState<(string | number)[]>([]);

    // читаем роль и токен из localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("access_token");
        const role = (localStorage.getItem("user_role") as UserRole) || null;

        setIsAuthorized(!!token);
        setUserRole(role);
    }, []);

    // читаем избранное из localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem("favorite_book_ids");

        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                setFavoriteIds(parsed);
            }
        } catch {
            // ничего, просто игнорим битые данные
        }
    }, []);

    // пишем избранное в localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem("favorite_book_ids", JSON.stringify(favoriteIds));
    }, [favoriteIds]);

    const isReader = isAuthorized && userRole === "Reader";
    const isLibrarian = isAuthorized && userRole === "Librarian";

    const toggleFavorite = (id: Book["id"]) => {
        setFavoriteIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((x) => x !== id);
            }
            return [...prev, id];
        });
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const mockBooks: Book[] = [
                    {
                        id: 1,
                        name: "1984",
                        author: "Джордж Оруэлл",
                        year: 1949,
                        coverUrl: "../../../public/fakecover.jpg",
                        reservedCount: 2,
                        totalCount: 5,
                    },
                    {
                        id: 2,
                        name: "Мастер и Маргарита",
                        author: "Михаил Булгаков",
                        year: 1967,
                        coverUrl: "../../../public/fakecover.jpg",
                        reservedCount: 1,
                        totalCount: 3,
                    },
                    {
                        id: 3,
                        name: "Преступление и наказание",
                        author: "Фёдор Достоевский",
                        year: 1866,
                        coverUrl: "../../../public/fakecover.jpg",
                        reservedCount: 0,
                        totalCount: 4,
                    },
                    {
                        id: 4,
                        name: "Трудно быть богом",
                        author: "Аркадий и Борис Стругацкие",
                        year: 1964,
                        coverUrl: "../../../public/fakecover.jpg",
                        reservedCount: 1,
                        totalCount: 2,
                    },
                    {
                        id: 5,
                        name: "Война и мир",
                        author: "Лев Толстой",
                        year: 1869,
                        coverUrl: "../../../public/fakecover.jpg",
                        reservedCount: 3,
                        totalCount: 7,
                    },
                    {
                        id: 6,
                        name: "Три товарища",
                        author: "Эрих Мария Ремарк",
                        year: 1936,
                        coverUrl: "../../../public/fakecover.jpg",
                        reservedCount: 0,
                        totalCount: 2,
                    },
                    {
                        id: 7,
                        name: "Над пропастью во ржи",
                        author: "Джером Д. Сэлинджер",
                        year: 1951,
                        coverUrl: "../../../public/fakecover.jpg",
                        reservedCount: 1,
                        totalCount: 3,
                    },
                    {
                        id: 8,
                        name: "Доктор Живаго",
                        author: "Борис Пастернак",
                        year: 1957,
                        coverUrl: "../../../public/fakecover.jpg",
                        reservedCount: 0,
                        totalCount: 1,
                    },
                    {
                        id: 9,
                        name: "Отцы и дети",
                        author: "Иван Тургенев",
                        year: 1862,
                        coverUrl: "../../../public/fakecover.jpg",
                        reservedCount: 2,
                        totalCount: 4,
                    },
                ];

                setTimeout(() => {
                    setBooks(mockBooks);
                    setIsLoading(false);
                }, 50);
            } catch (err) {
                console.error("Ошибка при загрузке списка книг:", err);
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    return (
        <>
            <Header />
            <main className="books-container">
                <h1 className="page-title-2">
                    {isLibrarian ? "Учёт книг" : "Список книг"}
                </h1>

                {isLoading ? (
                    <div className="empty-books-wrapper">
                        <p className="empty-books-text">Загружаем каталог...</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="empty-books-wrapper">
                        <p className="empty-books-text">
                            К сожалению, в данный момент ни одной книги нет в наличии.
                        </p>
                    </div>
                ) : (
                    <div className="books-list">
                        {books.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                mode={
                                    isLibrarian
                                        ? "librarian"
                                        : isReader
                                            ? "reader"
                                            : "public"
                                }
                                showFavorite={isReader}
                                isFavorite={isReader && favoriteIds.includes(book.id)}
                                onToggleFavorite={
                                    isReader
                                        ? () => toggleFavorite(book.id)
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default BooksPage;
