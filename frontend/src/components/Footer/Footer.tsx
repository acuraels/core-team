import { Link } from 'react-router-dom';
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <Link to="/about" className="footer-logo-block">
                        <img src="/logo.svg" className="footer-logo" />
                    </Link>
                </div>

                <div className="footer-right">
                    <a href='https://t.me/hackathon_sber' className="footer-link">Тг канал хакатона</a>
                    <a href='https://github.com/acuraels/core-team' className="footer-link">Наш GitHub</a>
                </div>
            </div>

            <div className='footer-bottom'>
                <span className='footer-bottom-text'>© 2024 ЕЧБ библиотеки №14. CoreTeam</span>
            </div>
        </footer>
    );
};

export default Footer;
