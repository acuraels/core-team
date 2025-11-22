import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./LoginPage.css";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <>
            <Header />
            <main className="main-container login-container">
                <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                    <h2 className="login-form-header">
                        Вход в единый читательский билет
                    </h2>

                    <input
                        type="text"
                        className="login-form-input"
                        placeholder="Логин"
                        maxLength={50}
                        required
                    />

                    <div className="login-form-password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="login-form-input login-form-input--password"
                            placeholder="Пароль"
                            maxLength={50}
                            required
                        />
                        <button
                            type="button"
                            className="login-form-password-toggle"
                            onClick={togglePassword}
                            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button type="submit" className="login-form-button">
                        Войти
                    </button>
                </form>
            </main>
            <Footer />
        </>
    );
};

export default LoginPage;
