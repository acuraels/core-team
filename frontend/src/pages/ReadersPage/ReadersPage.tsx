import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./ReadersPage.css";

interface Reader {
    id: string | number;
    name: string;
    surname: string;
    overdueCount: number; // просрочено
    takenCount: number;   // всего взято
}

const ReadersPage = () => {
    const [readers, setReaders] = useState<Reader[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [surnameInput, setSurnameInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const mockReaders: Reader[] = [
            { id: 1, name: "Иван", surname: "Иванов", overdueCount: 1, takenCount: 4 },
            { id: 2, name: "Мария", surname: "Петрова", overdueCount: 0, takenCount: 2 },
            { id: 3, name: "Алексей", surname: "Сидоров", overdueCount: 2, takenCount: 5 },
        ];

        setTimeout(() => setReaders(mockReaders), 50);
    }, []);

    const openModal = () => {
        setSurnameInput("");
        setNameInput("");
        setFormError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormError(null);
    };

    const handleCreateReader = (e: React.FormEvent) => {
        e.preventDefault();

        const surname = surnameInput.trim();
        const name = nameInput.trim();

        if (!surname || !name) {
            setFormError("Заполните фамилию и имя.");
            return;
        }

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

    const formatFio = (r: Reader) => `${r.surname} ${r.name}`;

    const handleOpenReader = (id: string | number) => {
        navigate(`/readers/${id}`);
    };

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
                                    <span className="readers-list-header-title">
                                        ФИ читателя
                                    </span>
                                    <span className="readers-list-header-title">
                                        Статус по книгам
                                    </span>
                                </div>

                                <div className="readers-list">
                                    {readers.map((reader) => (
                                        <div
                                            key={reader.id}
                                            className="reader-item"
                                            onClick={() => handleOpenReader(reader.id)}
                                        >
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

            {isModalOpen && (
                <div className="readers-modal-overlay" onClick={closeModal}>
                    <div
                        className="readers-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="readers-modal-title">Создать читателя</h2>
                        <p className="readers-modal-subtitle">
                            Введите фамилию и имя.
                        </p>

                        <form onSubmit={handleCreateReader} className="readers-modal-form">
                            <input
                                type="text"
                                className="readers-modal-input"
                                placeholder="Фамилия"
                                value={surnameInput}
                                onChange={(e) => setSurnameInput(e.target.value)}
                                maxLength={60}
                                autoFocus
                            />
                            <input
                                type="text"
                                className="readers-modal-input"
                                placeholder="Имя"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                maxLength={60}
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
