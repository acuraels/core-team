import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./LibrarianProfile.css";

interface Librarian {
    id: string;
    name: string;
    surname: string;
    identifier: string;
    login: string;
}

const LibrarianProfile = () => {
    const [librarian, setLibrarian] = useState<Librarian | null>(null);

    // временная статика — потом сюда воткнёшь запрос к бэку
    useEffect(() => {
        const mockLibrarian: Librarian = {
            id: "080246b0-222a-4aa4-9952-d4983abffe72",
            name: "vlad",
            surname: "vlad",
            identifier: "666443",
            login: "vlad",
        };

        setLibrarian(mockLibrarian);
    }, []);

    const fullName = librarian
        ? `${librarian.surname} ${librarian.name}`
        : "Загрузка...";

    return (
        <>
            <Header />
            <main className="main-container librarian-container">
                <div className="librarian-profile">
                    <div className="librarian-profile-header">
                        <div>
                            <h1 className="librarian-title">Личный кабинет библиотекаря</h1>
                            <p className="librarian-profile-subtitle">
                                Библиотека № 14 · цифровой сервис для работы с фондом и читателями
                            </p>
                        </div>

                        <Link to="/logout" className="librarian-logout-btn">
                            Выйти
                        </Link>
                    </div>

                    <section className="librarian-info-section">
                        <div className="librarian-info-card">
                            <p className="librarian-info-label">ФИО</p>
                            <p className="librarian-info-value">{fullName}</p>

                            {librarian && (
                                <>
                                    <p className="librarian-info-label">Логин</p>
                                    <p className="librarian-info-value">{librarian.login}</p>

                                    <p className="librarian-info-label">Идентификатор сотрудника</p>
                                    <p className="librarian-info-value">
                                        {librarian.identifier}
                                    </p>
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default LibrarianProfile;
