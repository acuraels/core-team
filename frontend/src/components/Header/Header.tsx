import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

type UserRole = "Reader" | "Librarian" | null;

const Header = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const [authPath, setAuthPath] = useState<string>("/login");
    const [authLabel, setAuthLabel] = useState<string>("Войти");

    const location = useLocation();

    // трекаем ширину экрана (мобилка / десктоп)
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // обновляем состояние кнопки при смене роутов / логине / логауте
    useEffect(() => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("user_role") as UserRole;

        if (token && role === "Reader") {
            setAuthPath("/reader-profile");
            setAuthLabel("Профиль");
        } else if (token && role === "Librarian") {
            setAuthPath("/librarian-profile");
            setAuthLabel("Профиль");
        } else {
            setAuthPath("/login");
            setAuthLabel("Войти");
        }
    }, [location.pathname]);

    const closeMenu = () => setMenuOpen(false);
    const toggleMenu = () => setMenuOpen((prev) => !prev);

    return (
        <header className="header" id="top">
            <div className="header-container">
                <nav className="header-nav">
                    <Link to="/about" className="header-left">
                        <img src="/logo.svg" className="logo-img" />
                    </Link>

                    <div className="header-right">
                        <Link to="/about" className="header-link">
                            О библиотеке
                        </Link>

                        <Link to="/books" className="header-link">
                            Книги
                        </Link>

                        <Link to="/events" className="header-link">
                            Мероприятия
                        </Link>

                        {/* на десктопе — динамическая кнопка (Войти / Профиль) */}
                        {!isMobile && (
                            <Link to={authPath} className="tg-login-btn">
                                {authLabel}
                            </Link>
                        )}

                        <button
                            type="button"
                            className={`burger-btn ${menuOpen ? "burger-btn--open" : ""}`}
                            onClick={toggleMenu}
                        >
                            <span className="burger-line" />
                        </button>
                    </div>
                </nav>
            </div>

            {/* бургер-меню для мобилы */}
            <div
                className={`menu-overlay ${menuOpen ? "menu-overlay--open" : ""}`}
                onClick={closeMenu}
            />
            <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
                <Link
                    to="/about"
                    className="mobile-menu-link"
                    onClick={closeMenu}
                >
                    О библиотеке
                </Link>

                <Link
                    to="/books"
                    className="mobile-menu-link"
                    onClick={closeMenu}
                >
                    Книги
                </Link>

                <Link
                    to="/events"
                    className="mobile-menu-link"
                    onClick={closeMenu}
                >
                    Мероприятия
                </Link>

                {/* на мобиле — та же динамическая кнопка, другой стиль */}
                {isMobile && (
                    <Link
                        to={authPath}
                        className="tg-login-btn-phone"
                        onClick={closeMenu}
                    >
                        {authLabel}
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
