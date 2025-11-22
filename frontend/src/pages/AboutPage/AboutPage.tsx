import { Link } from 'react-router-dom';
import { QrCode, BookOpen, Calendar, Sparkles, Users, ArrowRight } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import "./AboutPage.css";

const AboutPage = () => {
    return (
        <>
            <Header />
            <main className='main-container about-page'>

                {/* HERO SECTION */}
                <section className='hero-section'>
                    <div className='hero-content'>
                        <h1 className='hero-title'>
                            Библиотека №14 <br />
                            <span className='highlight'>Больше, чем просто книги</span>
                        </h1>
                        <p className='hero-subtitle'>
                            Единый цифровой читательский билет, умный поиск с ИИ
                            и центр культурной жизни Екатеринбурга в вашем смартфоне.
                        </p>
                        <div className='hero-buttons'>
                            <Link to="/login" className='btn-primary'>
                                Войти в личный кабинет
                            </Link>
                            <Link to="/books" className='btn-secondary'>
                                Перейти в каталог
                            </Link>
                        </div>
                    </div>
                    <div className='hero-visual'>
                        {/* Абстрактная визуализация цифрового билета */}
                        <div className='digital-card-mockup'>
                            <QrCode size={120} color="#077037" strokeWidth={1} />
                            <div className='mockup-text'>Читательский билет</div>
                        </div>
                    </div>
                </section>

                {/* FEATURES GRID */}
                <section className='features-section'>
                    <h2 className='section-title'>Цифровая среда нового поколения</h2>
                    <div className='features-grid'>
                        <div className='feature-card'>
                            <div className='icon-bg'><QrCode size={32} /></div>
                            <h3>Вход без пластика</h3>
                            <p>Забудьте о бумажных билетах. Ваш смартфон — это пропуск к тысячам книг и мероприятий.</p>
                        </div>
                        <div className='feature-card'>
                            <div className='icon-bg'><Sparkles size={32} /></div>
                            <h3>ИИ-Библиотекарь</h3>
                            <p>Искусственный интеллект подберет книгу, которая понравится именно вам, на основе ваших интересов.</p>
                        </div>
                        <div className='feature-card'>
                            <div className='icon-bg'><Calendar size={32} /></div>
                            <h3>События в один клик</h3>
                            <p>Лекции, мастер-классы и встречи с авторами. Бронируйте места мгновенно через приложение.</p>
                        </div>
                        <div className='feature-card'>
                            <div className='icon-bg'><BookOpen size={32} /></div>
                            <h3>Онлайн Каталог</h3>
                            <p>Проверяйте наличие книг в реальном времени и бронируйте их, не выходя из дома.</p>
                        </div>
                    </div>
                </section>

                {/* COMMUNITY HUB VISION */}
                <section className='vision-section'>
                    <div className='vision-content'>
                        <h2 className='section-title light'>Комьюнити-хаб</h2>
                        <p className='vision-text'>
                            Мы трансформируем классическую библиотеку в пространство для общения,
                            работы и творчества. Библиотека №14 — это место, где технологии
                            встречаются с культурой.
                        </p>
                        <ul className='vision-list'>
                            <li><Users size={20} /> Коворкинг-зоны</li>
                            <li><Users size={20} /> Дискуссионные клубы</li>
                            <li><Users size={20} /> Творческие мастерские</li>
                        </ul>
                        <Link to="/events" className='btn-outline'>
                            Смотреть афишу <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </Link>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
};

export default AboutPage;