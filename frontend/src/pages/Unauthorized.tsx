import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div
            className="notfound"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                gap: '15px',
                backgroundColor: '#077037'
            }}
        >
            <h1
                style={{
                    color: 'red'
                }}
            >ERROR 401</h1>
            <h3
                style={{
                    color: 'white'
                }}
            >Доступ запрещён! <br /> Вы не авторизованы для просмотра этой страницы.</h3>
            <Link to="/about" className="tg-login-btn">
                Вернуться на главную
            </Link>
        </div>
    );
};

export default NotFound;
