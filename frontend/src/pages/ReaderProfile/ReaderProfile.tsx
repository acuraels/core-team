import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BookCard from "../../components/BookCard/BookCard";

import "./ReaderProfile.css";

interface Book {
    id: string | number;
    name: string;
    author: string;
    year?: number;
    coverUrl?: string;
}

interface ReaderInfo {
    name: string;
    surname: string;
    login: string;
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

    // заглушка под загрузку данных читателя
    useEffect(() => {
        const storedName = localStorage.getItem("reader_name") || "Имя";
        const storedSurname = localStorage.getItem("reader_surname") || "Фамилия";
        const storedLogin = localStorage.getItem("reader_login") || "reader_login";

        setReaderInfo({
            name: storedName,
            surname: storedSurname,
            login: storedLogin,
        });
    }, []);

    // генерим / берём 6-значный код читателя
    useEffect(() => {
        let storedCode = localStorage.getItem("reader_code");

        if (!storedCode) {
            storedCode = String(Math.floor(100000 + Math.random() * 900000));
            localStorage.setItem("reader_code", storedCode);
        }

        setReaderCode(storedCode);
    }, []);

    // временная статика для раздела "Моя бронь"
    useEffect(() => {
        const mockReserved: Book[] = [
            {
                id: 101,
                name: "1984",
                author: "Джордж Оруэлл",
                year: 1949,
                coverUrl: "../../../public/fakecover.jpg",
            },
            {
                id: 102,
                name: "Мастер и Маргарита",
                author: "Михаил Булгаков",
                year: 1967,
                coverUrl: "../../../public/fakecover.jpg",
            },
            {
                id: 103,
                name: "Преступление и наказание",
                author: "Фёдор Достоевский",
                year: 1866,
                coverUrl: "../../../public/fakecover.jpg",
            },
        ];

        setTimeout(() => {
            setReservedBooks(mockReserved);
        }, 50);
    }, []);

    // заготовка под избранное
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

    // заготовка под выданные книги
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

        // TODO: здесь будет реальный запрос к бэку на смену пароля
        // например: await axiosInstance.post("/auth/change-password", { newPassword });

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

                    {/* блок с ФИО, логином и сменой пароля */}
                    <section className="reader-info-section">
                        <div className="reader-info-card">
                            <div className="reader-info-row">
                                <span className="reader-info-label">ФИО</span>
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
                                {showPasswordForm ? "Скрыть смену пароля" : "Сменить пароль"}
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
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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

                    <section className="reader-card-section">
                        <div className="reader-card">
                            <p className="reader-card-label">Номер читателя</p>
                            <p className="reader-card-code">{readerCode || "••••••"}</p>

                            <div className="reader-barcode">
                                <div
                                    className="reader-barcode-visual"
                                    aria-hidden="true"
                                />
                                <p className="reader-barcode-text">
                                    {readerCode || "000000"}
                                </p>
                            </div>

                            <p className="reader-card-hint">
                                Покажите штрихкод на входе или на стойке регистрации —
                                сотрудник отсканирует его вместо бумажного билета.
                            </p>
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
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="reader-books-tabs">
                        <div className="reader-tabs-header">
                            <button
                                type="button"
                                className={`reader-tab ${activeTab === "favorites" ? "reader-tab--active" : ""
                                    }`}
                                onClick={() => setActiveTab("favorites")}
                            >
                                Избранное
                            </button>
                            <button
                                type="button"
                                className={`reader-tab ${activeTab === "issued" ? "reader-tab--active" : ""
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
