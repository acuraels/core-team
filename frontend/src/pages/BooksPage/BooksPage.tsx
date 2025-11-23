// src/pages/BooksPage/BooksPage.tsx
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BookCard from "../../components/BookCard/BookCard";
// @ts-ignore
import axiosInstance from "../../utils/axiosInstance";

import "./BooksPage.css";

type UserRole = "Reader" | "Librarian" | null;

interface Book {
    id: string | number;
    name: string;
    author: string;
    year?: number;
    coverUrl?: string;
    description?: string;
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
        if (typeof window === "undefined") {
            return;
        }

        const token = localStorage.getItem("access_token");
        const role = (localStorage.getItem("user_role") as UserRole) || null;

        setIsAuthorized(!!token);
        setUserRole(role);
    }, []);

    // читаем избранное из localStorage
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const raw = localStorage.getItem("favorite_book_ids");

        if (!raw) {
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                setFavoriteIds(parsed);
            }
        } catch {
            // игнорируем битые данные
        }
    }, []);

    // пишем избранное в localStorage
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        localStorage.setItem("favorite_book_ids", JSON.stringify(favoriteIds));
    }, [favoriteIds]);

    const isReader = isAuthorized && userRole === "Reader";
    const isLibrarian = isAuthorized && userRole === "Librarian";

    const toggleFavorite = async (id: Book["id"]) => {
        if (!isReader) {
            return;
        }

        try {
            // если уже в избранном – удаляем
            if (favoriteIds.includes(id)) {
                await axiosInstance.delete(`books/${id}/favorite`);
                setFavoriteIds((prev) => prev.filter((x) => x !== id));
                return;
            }

            // иначе добавляем в избранное
            await axiosInstance.post(`books/${id}/favorite`);
            setFavoriteIds((prev) => [...prev, id]);
        } catch (error) {
            console.error("Ошибка при изменении избранного:", error);
        }
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setIsLoading(true);

                const response = await axiosInstance.get("books");
                const apiBooks = response.data as any[];

                const mapped: Book[] = apiBooks.map((b) => {
                    return {
                        id: b.id ?? b.Id,
                        name: b.name ?? b.Name,
                        author: b.author ?? b.Author,
                        year: b.publishedYear ?? b.PublishedYear,
                        coverUrl: b.imgPath ?? b.ImgPath ?? undefined,
                        description: b.description ?? b.Description ?? undefined,
                    };
                });

                setBooks(mapped);
            } catch (error) {
                console.error("Ошибка при загрузке списка книг:", error);
            } finally {
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
                                    isReader ? () => toggleFavorite(book.id) : undefined
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
