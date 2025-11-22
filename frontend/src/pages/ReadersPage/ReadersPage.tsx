import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./ReadersPage.css";

interface Reader {
    id: string | number;
    name: string;
    surname: string;
    patronymic?: string;
    overdueCount: number; // просрочено книг
    takenCount: number;   // всего взято книг
}

const ReadersPage = () => {
    const [readers, setReaders] = useState<Reader[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fioInput, setFioInput] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    // мок-данные — потом заменишь реальным запросом
    useEffect(() => {
        const mockReaders: Reader[] = [
            {
                id: 1,
                name: "Иван",
                surname: "Иванов",
                overdueCount: 1,
                takenCount: 4,
            },
            {
                id: 2,
                name: "Мария",
                surname: "Петрова",
                overdueCount: 0,
                takenCount: 2,
            },
            {
                id: 3,
                name: "Алексей",
                surname: "Сидоров",
                overdueCount: 2,
                takenCount: 5,
            },
        ];

        setTimeout(() => setReaders(mockReaders), 50);
    }, []);

    const openModal = () => {
        setFioInput("");
        setFormError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormError(null);
    };

    const handleCreateReader = (e: React.FormEvent) => {
        e.preventDefault();
        const parts = fioInput.trim().split(/\s+/).filter(Boolean);

        if (parts.length < 2) {
            setFormError("Введите фамилию и имя через пробел.");
            return;
        }

        const [surname, name] = parts;

        const newReader: Reader = {
            id: Date.now(),
            name,
            surname,
            overdueCount: 0,
            takenCount: 0,
        };

        setReaders((prev) => [newReader, ...prev]);
        closeModal();
    };

    const formatFio = (r: Reader) =>
        `${r.surname} ${r.name}${r.patronymic ? " " + r.patronymic : ""}`;

    return (
        <>
            <Header />
            <main className="main-container readers-page">
                <div className="readers-wrapper">
                    <div className="readers-header">
                        <h1 className="readers-title">Читатели</h1>

                        <button
                            type="button"
                            className="readers-create-btn"
                            onClick={openModal}
                        >
                            + Создать читателя
                        </button>
                    </div>

                    <section className="readers-list-section">
                        {readers.length === 0 ? (
                            <p className="readers-empty">
                                Пока ни одного читателя не зарегистрировано.
                            </p>
                        ) : (
                            <div className="readers-list-card">
                                <div className="readers-list-header-row">
                                    <span className="readers-list-header-title">ФИ читателя</span>
                                    <span className="readers-list-header-title">
                                        Статус по книгам
                                    </span>
                                </div>

                                <div className="readers-list">
                                    {readers.map((reader) => (
                                        <div key={reader.id} className="reader-item">
                                            <div className="reader-item-left">
                                                <p className="reader-item-name">
                                                    {formatFio(reader)}
                                                </p>
                                            </div>

                                            <div className="reader-item-right">
                                                <span className="reader-item-stat">
                                                    Просрочено:{" "}
                                                    <strong>{reader.overdueCount}</strong>
                                                </span>
                                                <span className="reader-item-separator">·</span>
                                                <span className="reader-item-stat">
                                                    Взято:{" "}
                                                    <strong>{reader.takenCount}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />

            {/* модалка создания читателя */}
            {isModalOpen && (
                <div className="readers-modal-overlay" onClick={closeModal}>
                    <div
                        className="readers-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="readers-modal-title">Создать читателя</h2>
                        <p className="readers-modal-subtitle">
                            Введите ФИ через пробел. Например:{" "}
                            <span className="readers-modal-example">
                                Иванов Иван
                            </span>
                        </p>

                        <form onSubmit={handleCreateReader} className="readers-modal-form">
                            <input
                                type="text"
                                className="readers-modal-input"
                                placeholder="Фамилия Имя"
                                value={fioInput}
                                onChange={(e) => setFioInput(e.target.value)}
                                maxLength={120}
                                autoFocus
                            />

                            {formError && (
                                <p className="readers-modal-error">{formError}</p>
                            )}

                            <div className="readers-modal-actions">
                                <button
                                    type="submit"
                                    className="readers-modal-btn readers-modal-btn--primary"
                                >
                                    Создать
                                </button>
                                <button
                                    type="button"
                                    className="readers-modal-btn readers-modal-btn--secondary"
                                    onClick={closeModal}
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReadersPage;
