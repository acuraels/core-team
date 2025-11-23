import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    QrCode,
    BookOpen,
    Calendar,
    Sparkles,
    Users,
    ArrowRight,
} from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./AboutPage.css";

type UserRole = "Reader" | "Librarian" | null;

type RoomId =
    | "entrance"
    | "5"
    | "7"
    | "9"
    | "14"
    | "10"
    | "11"
    | "12"
    | "13";

interface Space {
    id: RoomId;
    label: string; // что пишем внутри блока на схеме
    title: string; // заголовок справа
    description: string; // описание зоны
    gridClass: string; // класс для позиционирования в сетке
}

const SPACES: Space[] = [
    {
        id: "entrance",
        label: "Вход",
        title: "Входная зона · арт-объект «Голос города»",
        description:
            "Главный вход и зона встречи посетителей. Здесь расположен арт-объект «Голос города» — точка сборки впечатлений и первый контакт с библиотекой.",
        gridClass: "room-entrance",
    },
    {
        id: "5",
        label: "5",
        title: "Абонемент для детей (5)",
        description:
            "Уютное пространство для юных читателей: детский фонд, тематические подборки и место для первых шагов в мире книг.",
        gridClass: "room-5",
    },
    {
        id: "7",
        label: "7",
        title: "Гардероб (7)",
        description:
            "Гардеробная зона, где можно оставить верхнюю одежду и комфортно перейти к пространствам библиотеки.",
        gridClass: "room-7",
    },
    {
        id: "9",
        label: "9",
        title: "Абонемент (9)",
        description:
            "Основной абонемент: выдача и приём книг, консультации по фонду, помощь библиотекаря в подборе литературы.",
        gridClass: "room-9",
    },
    {
        id: "14",
        label: "14",
        title: "Читальный зал (14)",
        description:
            "Читальный зал, стилизованный под пространство вагона поезда: длинные столы, уютные места и атмосфера путешествия через книги.",
        gridClass: "room-10",
    },
    {
        id: "10",
        label: "10",
        title: "Событийный зал (10)",
        description:
            "Многофункциональный событийный зал, оснащённый мультимедийной техникой. Здесь проходят лекции, показы, дискуссии и концерты.",
        gridClass: "room-14",
    },
    {
        id: "11",
        label: "11",
        title: "Хранение книг (11)",
        description:
            "Служебное помещение для хранения фонда: стеллажи с книгами, которые пополняют абонементы и залы библиотеки.",
        gridClass: "room-11",
    },
    {
        id: "12",
        label: "12",
        title: "Молодёжный зал (12)",
        description:
            "Многофункциональный молодёжный зал с амфитеатром: пространство для встреч, проектов, кинопоказов и лайв-форматов.",
        gridClass: "room-12",
    },
    {
        id: "13",
        label: "13",
        title: "Зал искусств (13)",
        description:
            "Зал искусств — арт-галерея и многофункциональное пространство для выставок, перформансов и арт-мероприятий. В структуру зала входят 13.1 «Проектный офис» и 13.2 «Медиасреда» (подкастерная).",
        gridClass: "room-13",
    },
];

const AboutPage = () => {
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [activeRoomId, setActiveRoomId] = useState<RoomId>("entrance");

    useEffect(() => {
        if (typeof window === "undefined") return;
        const storedRole = (localStorage.getItem("user_role") as UserRole) || null;
        setUserRole(storedRole);
    }, []);

    const activeRoom = SPACES.find((space) => space.id === activeRoomId);

    return (
        <>
            <Header />
            <main className="main-container about-page">
                {/* HERO SECTION */}
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Библиотека №14 <br />
                            <span className="highlight">Больше, чем просто книги</span>
                        </h1>
                        <p className="hero-subtitle">
                            Единый цифровой читательский билет, умный поиск с ИИ
                            и центр культурной жизни Екатеринбурга в вашем смартфоне.
                        </p>

                        {userRole === "Reader" ? (
                            <div className="hero-buttons">
                                <Link to="/reader-profile" className="btn-primary">
                                    Перейти в личный кабинет
                                </Link>
                                <Link to="/books" className="btn-secondary">
                                    Перейти в каталог
                                </Link>
                            </div>
                        ) : userRole === "Librarian" ? (
                            <div className="hero-buttons">
                                <Link to="/librarian-profile" className="btn-primary">
                                    Перейти в личный кабинет
                                </Link>
                                <Link to="/books" className="btn-secondary">
                                    Перейти в каталог
                                </Link>
                            </div>
                        ) : (
                            <div className="hero-buttons">
                                <Link to="/login" className="btn-primary">
                                    Войти в личный кабинет
                                </Link>
                                <Link to="/books" className="btn-secondary">
                                    Перейти в каталог
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="hero-visual">
                        <div className="digital-card-mockup">
                            <a
                                href="https://t.me/echb14_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ cursor: "pointer", display: "inline-flex" }}
                                title="Перейти в Telegram-бот"
                            >
                                <img
                                    src="/qr.svg"
                                    width="120"
                                    height="120"
                                    alt="QR-код читательского билета"
                                />
                            </a>
                            <div className="mockup-text">Читательский билет</div>
                        </div>
                    </div>
                </section>

                {/* FEATURES GRID */}
                <section className="features-section">
                    <h2 className="section-title">Цифровая среда нового поколения</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="icon-bg">
                                <QrCode size={32} />
                            </div>
                            <h3>Вход без пластика</h3>
                            <p>
                                Забудьте о бумажных билетах. Ваш смартфон — это пропуск к
                                тысячам книг и мероприятий.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="icon-bg">
                                <Sparkles size={32} />
                            </div>
                            <h3>ИИ-Библиотекарь</h3>
                            <p>
                                Искусственный интеллект подберет книгу, которая понравится
                                именно вам, на основе ваших интересов.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="icon-bg">
                                <Calendar size={32} />
                            </div>
                            <h3>События в один клик</h3>
                            <p>
                                Лекции, мастер-классы и встречи с авторами. Бронируйте места
                                мгновенно через приложение.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="icon-bg">
                                <BookOpen size={32} />
                            </div>
                            <h3>Онлайн Каталог</h3>
                            <p>
                                Проверяйте наличие книг в реальном времени и бронируйте их,
                                не выходя из дома.
                            </p>
                        </div>
                    </div>
                </section>

                {/* COMMUNITY HUB VISION */}
                <section className="vision-section">
                    <div className="vision-content">
                        <h2 className="section-title light">Комьюнити-хаб</h2>
                        <p className="vision-text">
                            Мы трансформируем классическую библиотеку в пространство для
                            общения, работы и творчества. Библиотека №14 — это место, где
                            технологии встречаются с культурой.
                        </p>
                        <ul className="vision-list">
                            <li>
                                <Users size={20} /> Коворкинг-зоны
                            </li>
                            <li>
                                <Users size={20} /> Дискуссионные клубы
                            </li>
                            <li>
                                <Users size={20} /> Творческие мастерские
                            </li>
                        </ul>
                        <Link to="/events" className="btn-outline">
                            Смотреть афишу{" "}
                            <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </Link>
                    </div>
                </section>

                {/* INTERACTIVE MAP */}
                <section className="map-section">
                    <div className="map-section-header">
                        <h2 className="section-title">Навигация по пространству</h2>
                        <p className="map-section-subtitle">
                            Нажмите на зону на схеме, чтобы увидеть, что это за пространство
                            и чем оно живёт.
                        </p>
                    </div>

                    <div className="map-layout">
                        <div
                            className="map-plan"
                            aria-label="План библиотеки №14"
                        >
                            {SPACES.map((space) => (
                                <button
                                    key={space.id}
                                    type="button"
                                    className={`map-room ${space.gridClass} ${activeRoomId === space.id
                                        ? "map-room--active"
                                        : ""
                                        }`}
                                    onClick={() => setActiveRoomId(space.id)}
                                    onMouseEnter={() => setActiveRoomId(space.id)}
                                >
                                    <span className="map-room-number">
                                        {space.id === "entrance"
                                            ? "Вход"
                                            : space.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="map-details">
                            <p className="map-details-label">Выбрана зона</p>
                            <h3 className="map-details-title">
                                {activeRoom?.title ?? "Зона не выбрана"}
                                {activeRoom && activeRoom.id !== "entrance" && (
                                    <span className="map-details-number">
                                        № {activeRoom.label}
                                    </span>
                                )}
                            </h3>
                            {activeRoom && (
                                <>
                                    <p className="map-details-text">
                                        {activeRoom.description}
                                    </p>

                                    {activeRoom.id === "13" && (
                                        <ul className="map-details-subrooms">
                                            <li>
                                                <strong>13.1</strong> — Проектный
                                                офис
                                            </li>
                                            <li>
                                                <strong>13.2</strong> — Медиасреда
                                                (подкастерная)
                                            </li>
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default AboutPage;
