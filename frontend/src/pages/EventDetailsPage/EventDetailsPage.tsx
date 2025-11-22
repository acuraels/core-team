import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import type { LibraryEvent } from '../../components/EventCard/EventCard';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Получаем данные из стейта и типизируем их
    const event = location.state?.event as LibraryEvent;

    if (!event) {
        return (
            <>
                <Header />
                <main className="event-details-container error-container">
                    <h2>Событие не найдено</h2>
                    <button className="back-button" onClick={() => navigate('/events')}>
                        Вернуться к афише
                    </button>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="event-details-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    Назад к афише
                </button>
                
                <div className="event-details-content">
                    {/* Левая колонка: Изображение */}
                    <div className="event-details-image-col">
                        <div className="event-details-image-wrapper">
                            {event.coverUrl ? (
                                <img src={event.coverUrl} alt={event.title} className="event-details-cover" />
                            ) : (
                                <div className="event-details-placeholder">
                                    {event.title[0]}
                                </div>
                            )}
                             {event.isFree && <span className="event-details-badge">Бесплатно</span>}
                        </div>
                    </div>

                    {/* Правая колонка: Информация */}
                    <div className="event-details-info-col">
                        <h1 className="event-details-title">{event.title}</h1>
                        
                        <div className="event-details-meta-grid">
                            <div className="event-meta-box">
                                <Calendar className="event-meta-icon" />
                                <div>
                                    <span className="meta-label">Дата</span>
                                    <p className="meta-value">{event.date}</p>
                                </div>
                            </div>
                            <div className="event-meta-box">
                                <Clock className="event-meta-icon" />
                                <div>
                                    <span className="meta-label">Время</span>
                                    <p className="meta-value">{event.time}</p>
                                </div>
                            </div>
                            <div className="event-meta-box">
                                <MapPin className="event-meta-icon" />
                                <div>
                                    <span className="meta-label">Место</span>
                                    <p className="meta-value">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="event-details-description">
                            <h3>О мероприятии</h3>
                            <p>{event.description}</p>
                            {/* Дополнительный текст-рыба, если описание короткое */}
                            <p>
                                Приходите заранее, чтобы занять лучшие места. 
                                Если у вас изменились планы, пожалуйста, отмените запись в личном кабинете.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default EventDetailsPage;