import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./ReaderDetailsPage.css";

interface ReaderInfo {
    name: string;
    surname: string;
    login: string;
}

interface Book {
    id: string | number;
    name: string;
    author: string;
    year?: number;
    coverUrl?: string;
    storageCode?: string;
}

const ReaderDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    const [readerCode, setReaderCode] = useState<string>("");
    const [readerInfo, setReaderInfo] = useState<ReaderInfo | null>(null);

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    const [reservedBooks, setReservedBooks] = useState<Book[]>([]);

    // заглушка под загрузку данных читателя по id
    useEffect(() => {
        if (!id) return;

        // TODO: заменить на реальный запрос к API:
        // const { data } = await axiosInstance.get(`/readers/${id}`)
        const mock: ReaderInfo = {
            name: "Иван",
            surname: "Иванов",
            login: `reader_${id}`,
        };

        setReaderInfo(mock);
    }, [id]);

    // отдельный код читателя, привязанный к id
    useEffect(() => {
        if (!id) return;

        const storageKey = `reader_code_${id}`;
        let storedCode = localStorage.getItem(storageKey);

        if (!storedCode) {
            storedCode = String(Math.floor(100000 + Math.random() * 900000));
            localStorage.setItem(storageKey, storedCode);
        }

        setReaderCode(storedCode);
    }, [id]);

    // заглушка под список забронированных книг конкретного читателя
    useEffect(() => {
        if (!id) return;

        // TODO: заменить на реальный запрос:
        // const { data } = await axiosInstance.get(`/readers/${id}/reservations`)
        const mockReserved: Book[] = [
            {
                id: 101,
                name: "1984",
                author: "Джордж Оруэлл",
                year: 1949,
                coverUrl: "../../../public/fakecover.jpg",
                storageCode: "84(4Вел)-9 О-78", // пример шифра
            },
            {
                id: 102,
                name: "Мастер и Маргарита",
                author: "Михаил Булгаков",
                year: 1967,
                coverUrl: "../../../public/fakecover.jpg",
                storageCode: "84(2Рос=Рус)-4 Б-85",
            },
            {
                id: 103,
                name: "Преступление и наказание",
                author: "Фёдор Достоевский",
                year: 1866,
                coverUrl: "../../../public/fakecover.jpg",
                storageCode: "84(2Рос=Рус)-4 Д-73",
            },
        ];

        setTimeout(() => {
            setReservedBooks(mockReserved);
        }, 50);
    }, [id]);

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

        // TODO: здесь будет реальный запрос к бэку от имени библиотекаря:
        // await axiosInstance.post(`/readers/${id}/change-password`, { newPassword });

        await new Promise((resolve) => setTimeout(resolve, 400));

        setPasswordSuccess("Пароль читателя успешно изменён.");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
    };

    const handleRejectReservation = (bookId: Book["id"]) => {
        // TODO: запрос на бэк: отмена брони
        // await axiosInstance.post(`/reservations/${bookId}/reject`)
        setReservedBooks((prev) => prev.filter((b) => b.id !== bookId));
    };

    const handleIssueBook = (bookId: Book["id"]) => {
        // TODO: запрос на бэк: подтверждение выдачи
        // await axiosInstance.post(`/reservations/${bookId}/issue`)
        setReservedBooks((prev) => prev.filter((b) => b.id !== bookId));
    };

    return (
        <>
            <Header />
            <main className="main-container librarian-container">
                <div className="reader-profile">
                    <div className="reader-profile-header">
                        <div>
                            <h1 className="librarian-title">Профиль читателя</h1>
                            <p className="reader-profile-subtitle">
                                Библиотека № 14 · Карточка читателя
                                {id ? ` № ${id}` : ""}
                            </p>
                        </div>

                        <Link to="/readers" className="reader-back-btn">
                            Назад к списку
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
                                {showPasswordForm
                                    ? "Скрыть смену пароля"
                                    : "Сменить пароль читателя"}
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

                    {/* карта читателя и штрихкод */}
                    <section className="reader-card-section">
                        <div className="reader-card">
                            <p className="reader-card-label">Номер читателя</p>
                            <p className="reader-card-code">
                                {readerCode || "••••••"}
                            </p>

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
                                Покажите штрихкод читателю или используйте при
                                обслуживании вместо бумажного билета.
                            </p>
                        </div>
                    </section>

                    {/* список забронированных книг */}
                    <section className="reader-reserved-section">
                        <h2 className="reader-reserved-title">Забронировано</h2>

                        {reservedBooks.length === 0 ? (
                            <p className="reader-reserved-empty">
                                У читателя нет активных бронирований.
                            </p>
                        ) : (
                            <div className="reader-reserved-list">
                                {reservedBooks.map((book) => (
                                    <div
                                        key={book.id}
                                        className="reader-reserved-card"
                                    >
                                        <div className="reader-reserved-card-top">
                                            {book.coverUrl ? (
                                                <img
                                                    src={book.coverUrl}
                                                    alt={book.name}
                                                    className="reader-reserved-cover"
                                                />
                                            ) : (
                                                <div className="reader-reserved-cover-placeholder">
                                                    {book.name[0]}
                                                </div>
                                            )}

                                            <div className="reader-reserved-info">
                                                <p className="reader-reserved-book-title">
                                                    {book.name}
                                                </p>
                                                <p className="reader-reserved-book-author">
                                                    {book.author}
                                                </p>
                                                {book.year && (
                                                    <p className="reader-reserved-book-year">
                                                        {book.year}
                                                    </p>
                                                )}

                                                {book.storageCode && (
                                                    <p className="reader-reserved-book-code">
                                                        Шифр хранения: <span>{book.storageCode}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="reader-reserved-actions">
                                            <button
                                                type="button"
                                                className="reader-reserved-btn reader-reserved-btn--reject"
                                                onClick={() =>
                                                    handleRejectReservation(
                                                        book.id
                                                    )
                                                }
                                            >
                                                Отклонить
                                            </button>
                                            <button
                                                type="button"
                                                className="reader-reserved-btn reader-reserved-btn--issue"
                                                onClick={() =>
                                                    handleIssueBook(book.id)
                                                }
                                            >
                                                Выдать
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ReaderDetailsPage;
