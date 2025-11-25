import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
// @ts-ignore
import axiosInstance from "../../utils/axiosInstance";

import "./LoginPage.css";

type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    userId: string;
    role: number; // 1 = Reader, 2 = Librarian
};

const LoginPage = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const { data } = await axiosInstance.post<AuthResponse>("auth/login", {
                login: login,
                password: password
            });

            localStorage.setItem("access_token", data.accessToken);
            localStorage.setItem("Bearer", data.accessToken);
            localStorage.setItem("refresh_token", data.refreshToken);
            localStorage.setItem("user_id", data.userId);

            let roleString = "";

            if (data.role === 1) {
                roleString = "Reader";
            }
            else if (data.role === 2) {
                roleString = "Librarian";
            }

            localStorage.setItem("user_role", roleString);

            if (data.role === 1)
            {
                navigate("/reader-profile");
            }
            else if (data.role === 2)
            {
                navigate("/librarian-profile");
            }
            else
            {
                navigate("/unauthorized");
            }
        }
        catch (err: any) {
            if (err.response?.status === 401)
            {
                setError("Неверный логин или пароль");
            }
            else
            {
                setError("Ошибка при входе. Попробуйте позже");
            }
        }
    };

    return (
        <>
            <Header />
            <main className="main-container login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2 className="login-form-header">
                        Вход в единый читательский билет
                    </h2>

                    <input
                        type="text"
                        className="login-form-input"
                        placeholder="Логин"
                        maxLength={50}
                        required
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />

                    <div className="login-form-password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="login-form-input login-form-input--password"
                            placeholder="Пароль"
                            maxLength={50}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    {error && (
                        <p className="login-form-error">
                            {error}
                        </p>
                    )}

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
