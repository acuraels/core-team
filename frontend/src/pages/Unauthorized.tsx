import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div
            className="unauthorized"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
                gap: "15px",
            }}
        >
            <h1
                style={{
                    color: "red",
                }}
            >
                ERROR 401
            </h1>
            <h3
                style={{
                    color: "#F3C041",
                }}
            >
                Доступ запрещён! <br /> Вы не авторизованы для просмотра этой страницы.
            </h3>
            <Link to="/login" className="tg-login-btn">
                Вернуться ко входу
            </Link>
        </div>
    );
};

export default Unauthorized;
