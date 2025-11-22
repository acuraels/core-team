import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

                        {/* на десктопе кнопка "Войти" в хэдере */}
                        {!isMobile && (
                            <Link to="/login" className="tg-login-btn">
                                Войти
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

                {/* на мобиле "Войти" только внутри меню, с тем же стилем */}
                {isMobile && (
                    <Link
                        to="/login"
                        className="tg-login-btn-phone"
                        onClick={closeMenu}
                    >
                        Войти
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
