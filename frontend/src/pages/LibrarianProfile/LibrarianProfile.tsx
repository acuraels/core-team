import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
// @ts-expect-error — JS файл без типов
import axiosInstance from "../../utils/axiosInstance";

import "./LibrarianProfile.css";

interface Librarian {
    id: string;
    name: string;
    surname: string;
    identifier: string;
    login: string;
    // role тоже есть на бэке, но тут не обязателен
}

const LibrarianProfile = () => {
    const [librarian, setLibrarian] = useState<Librarian | null>(null);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const { data } = await axiosInstance.get<Librarian>("/users/me");

                setLibrarian({
                    id: data.id,
                    name: data.name,
                    surname: data.surname,
                    login: data.login,
                    identifier: data.identifier,
                });
            } catch (error) {
                console.error("Не удалось загрузить данные библиотекаря:", error);

                // простая заглушка, если запрос упал
                setLibrarian({
                    id: "fallback",
                    name: "Имя",
                    surname: "Фамилия",
                    login: "librarian_login",
                    identifier: "000000",
                });
            }
        };

        fetchMe();
    }, []);

    const fullName = librarian
        ? `${librarian.surname} ${librarian.name}`
        : "Загрузка...";

    const staffIdentifier =
        librarian && librarian.identifier
            ? librarian.identifier.padStart(6, "0")
            : "••••••";

    return (
        <>
            <Header />
            <main className="main-container librarian-container">
                <div className="librarian-profile">
                    <div className="librarian-profile-header">
                        <div>
                            <h1 className="librarian-title">
                                Личный кабинет библиотекаря
                            </h1>
                            <p className="librarian-profile-subtitle">
                                Библиотека № 14 · цифровой сервис для работы с фондом и
                                читателями
                            </p>
                        </div>

                        <Link to="/logout" className="librarian-logout-btn">
                            Выйти
                        </Link>
                    </div>

                    <section className="librarian-info-section">
                        <div className="librarian-info-card">
                            <p className="librarian-info-label">ФИ</p>
                            <p className="librarian-info-value">{fullName}</p>

                            <p className="librarian-info-label">Логин</p>
                            <p className="librarian-info-value">
                                {librarian ? librarian.login : "—"}
                            </p>

                            <p className="librarian-info-label">
                                Идентификатор сотрудника
                            </p>
                            <p className="librarian-info-value">{staffIdentifier}</p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default LibrarianProfile;
