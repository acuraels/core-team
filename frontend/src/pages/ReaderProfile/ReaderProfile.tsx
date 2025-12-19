import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BookCard from "../../components/BookCard/BookCard";

// @ts-expect-error — JS файл без типов
import axiosInstance from "../../utils/axiosInstance";

import "./ReaderProfile.css";
import BarCode from "../../components/BarCode/BarCode";

interface Book {
    id: string | number;
    name: string;
    author: string;
    year?: number;
    coverUrl?: string;
    reservationUntil?: string;
}

interface ReaderInfo {
    name: string;
    surname: string;
    login: string;
}

interface MeResponse {
    id: string;
    name: string;
    surname: string;
    identifier: string;
    login: string;
    role: number | string;
}

type BooksTab = "favorites" | "issued";

const ReaderProfile = () => {
    const [readerCode, setReaderCode] = useState<string>("");
    const [readerInfo, setReaderInfo] = useState<ReaderInfo | null>(null);

    const [reservedBooks, setReservedBooks] = useState<Book[]>([]);
    const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
    const [issuedBooks, setIssuedBooks] = useState<Book[]>([]);
    const [activeTab, setActiveTab] = useState<BooksTab>("issued");

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    // грузим текущего пользователя с бэка
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const { data } = await axiosInstance.get<MeResponse>("/users/me");

                setReaderInfo({
                    name: data.name,
                    surname: data.surname,
                    login: data.login,
                });

                if (data.identifier && data.identifier.length > 0) {
                    setReaderCode(data.identifier);
                } else {
                    const fallback = String(
                        Math.floor(100000 + Math.random() * 900000)
                    );
                    setReaderCode(fallback);
                }
            } catch (error) {
                console.error("Не удалось загрузить данные читателя:", error);

                // если запрос упал
                setReaderInfo({
                    name: "Имя",
                    surname: "Фамилия",
                    login: "reader_login",
                });

                const fallback = String(
                    Math.floor(100000 + Math.random() * 900000)
                );
                setReaderCode(fallback);
            }
        };

        fetchMe();
    }, []);

    // моки для раздела "Моя бронь"
    useEffect(() => {
        const mockReserved: Book[] = [
            {
                id: 101,
                name: "1984",
                author: "Джордж Оруэлл",
                year: 1949,
                coverUrl: "../../../public/fakecover.jpg",
                reservationUntil: "12.12.2025",
            },
            {
                id: 102,
                name: "Мастер и Маргарита",
                author: "Михаил Булгаков",
                year: 1967,
                coverUrl: "../../../public/fakecover.jpg",
                reservationUntil: "15.12.2025",
            },
            {
                id: 103,
                name: "Преступление и наказание",
                author: "Фёдор Достоевский",
                year: 1866,
                coverUrl: "../../../public/fakecover.jpg",
                reservationUntil: "20.12.2025",
            },
        ];

        setTimeout(() => {
            setReservedBooks(mockReserved);
        }, 50);
    }, []);

    // моки под избранное
    useEffect(() => {
        const mockFavorites: Book[] = [
            {
                id: 201,
                name: "Пикник на обочине",
                author: "Аркадий и Борис Стругацкие",
                year: 1972,
                coverUrl: "../../../public/fakecover.jpg",
            },
            {
                id: 202,
                name: "Три товарища",
                author: "Эрих Мария Ремарк",
                year: 1936,
                coverUrl: "../../../public/fakecover.jpg",
            },
        ];

        setTimeout(() => {
            setFavoriteBooks(mockFavorites);
        }, 50);
    }, []);

    // моки под выданные
    useEffect(() => {
        const mockIssued: Book[] = [
            {
                id: 301,
                name: "Над пропастью во ржи",
                author: "Джером Д. Сэлинджер",
                year: 1951,
                coverUrl: "../../../public/fakecover.jpg",
            },
            {
                id: 302,
                name: "Анна Каренина",
                author: "Лев Толстой",
                year: 1877,
                coverUrl: "../../../public/fakecover.jpg",
            },
        ];

        setTimeout(() => {
            setIssuedBooks(mockIssued);
        }, 50);
    }, []);

    const renderActiveTabBooks = () => {
        const booksToShow = activeTab === "favorites" ? favoriteBooks : issuedBooks;

        if (booksToShow.length === 0) {
            return (
                <p className="reader-empty-tab">
                    {activeTab === "favorites"
                        ? "В избранном пока нет книг."
                        : "У вас нет выданных книг."}
                </p>
            );
        }

        return (
            <div className="reader-books-list">
                {booksToShow.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        );
    };

    const togglePasswordForm = () => {
        setShowPasswordForm((prev) => !prev);
        setPasswordError(null);
        setPasswordSuccess(null);
        setNewPassword("");
        setConfirmPassword("");
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (!newPassword || !confirmPassword) {
            setPasswordError("Заполните оба поля.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Пароль должен быть не короче 6 символов.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Пароли не совпадают.");
            return;
        }

        // тут потом будет запрос на смену пароля

        await new Promise((resolve) => setTimeout(resolve, 400));

        setPasswordSuccess("Пароль успешно изменён.");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
    };

    return (
        <>
            <Header />
            <main className="main-container librarian-container">
                <div className="reader-profile">
                    <div className="reader-profile-header">
                        <div>
                            <h1 className="librarian-title">Личный кабинет читателя</h1>
                            <p className="reader-profile-subtitle">
                                Библиотека № 14 · Единый читательский билет
                            </p>
                        </div>

                        <Link to="/logout" className="reader-logout-btn">
                            Выйти
                        </Link>
                    </div>

                    <section className="reader-card-section">
                        <div className="reader-card">
                            <p className="reader-card-label">Номер читателя</p>
                            <p className="reader-card-code">
                                {readerCode || "••••••"}
                            </p>

                            <BarCode readerCode={readerCode} />

                            <p className="reader-card-hint">
                                Покажите штрихкод на входе или на стойке регистрации —
                                сотрудник отсканирует его вместо бумажного билета.
                            </p>
                        </div>
                    </section>

                    {/* блок с ФИ, логином и сменой пароля */}
                    <section className="reader-info-section">
                        <div className="reader-info-card">
                            <div className="reader-info-row">
                                <span className="reader-info-label">ФИ</span>
                                <span className="reader-info-value">
                                    {readerInfo
                                        ? `${readerInfo.surname} ${readerInfo.name}`
                                        : "Загрузка..."}
                                </span>
                            </div>

                            <div className="reader-info-row">
                                <span className="reader-info-label">Логин</span>
                                <span className="reader-info-value">
                                    {readerInfo ? readerInfo.login : "—"}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="reader-change-password-btn"
                                onClick={togglePasswordForm}
                            >
                                {showPasswordForm
                                    ? "Скрыть смену пароля"
                                    : "Сменить пароль"}
                            </button>

                            {passwordSuccess && (
                                <p className="reader-password-success">
                                    {passwordSuccess}
                                </p>
                            )}

                            {showPasswordForm && (
                                <form
                                    className="reader-password-form"
                                    onSubmit={handlePasswordSubmit}
                                >
                                    <input
                                        type="password"
                                        className="reader-password-input"
                                        placeholder="Новый пароль"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        className="reader-password-input"
                                        placeholder="Повторите новый пароль"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                    />

                                    {passwordError && (
                                        <p className="reader-password-error">
                                            {passwordError}
                                        </p>
                                    )}

                                    <div className="reader-password-actions">
                                        <button
                                            type="submit"
                                            className="reader-password-btn reader-password-btn--primary"
                                        >
                                            Применить
                                        </button>
                                        <button
                                            type="button"
                                            className="reader-password-btn reader-password-btn--secondary"
                                            onClick={togglePasswordForm}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </section>

                    <section className="reader-reservations">
                        <h2 className="reader-section-title">Моя бронь</h2>

                        {reservedBooks.length === 0 ? (
                            <p className="reader-empty-reservations">
                                У вас пока нет забронированных книг.
                            </p>
                        ) : (
                            <div className="reader-books-list">
                                {reservedBooks.map((book) => (
                                    <div
                                        key={book.id}
                                        className="reader-reservation-item"
                                    >
                                        <BookCard book={book} />
                                        {book.reservationUntil && (
                                            <p className="reader-reservation-date">
                                                Бронь до:{" "}
                                                <span>{book.reservationUntil}</span>
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="reader-books-tabs">
                        <div className="reader-tabs-header">
                            <button
                                type="button"
                                className={`reader-tab ${activeTab === "favorites"
                                        ? "reader-tab--active"
                                        : ""
                                    }`}
                                onClick={() => setActiveTab("favorites")}
                            >
                                Избранное
                            </button>
                            <button
                                type="button"
                                className={`reader-tab ${activeTab === "issued"
                                        ? "reader-tab--active"
                                        : ""
                                    }`}
                                onClick={() => setActiveTab("issued")}
                            >
                                Выданные книги
                            </button>
                        </div>

                        <div className="reader-tabs-content">
                            {renderActiveTabBooks()}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ReaderProfile;
