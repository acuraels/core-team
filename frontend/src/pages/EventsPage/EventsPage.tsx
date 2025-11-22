import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import EventCard, { type LibraryEvent } from '../../components/EventCard/EventCard';
import './EventsPage.css';

const EventsPage = () => {
    const [events, setEvents] = useState<LibraryEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                
                // Моковые данные для хакатона
                const mockEvents: LibraryEvent[] = [
                    {
                        id: 1,
                        name: "Встреча с автором: Алексей Иванов",
                        description: "Уникальная возможность пообщаться с автором бестселлеров, обсудить новинки литературы и получить автограф.",
                        start_at: "24 ноября 18:00",
                        end_at: "120 минут",
                        event_image: ''
                    },
                    {
                        id: 2,
                        name: "Мастер-класс по реставрации книг",
                        description: "Научимся базовым техникам восстановления старых переплетов и ухода за домашней библиотекой.",
                        start_at: "26 ноября 14:00",
                        end_at: "120 минут",
                        event_image: '' 
                    },
                    {
                        id: 3,
                        name: "Лекция: История Екатеринбурга",
                        description: "Погружение в исторические тайны города с ведущим краеведом области.",
                        start_at: "11 декабря 19:00",
                        end_at: "120 минут",
                        event_image: '' 
                    },
                    {
                        id: 4,
                        name: "Детский книжный клуб",
                        description: "Читаем сказки и обсуждаем их с самыми маленькими посетителями.",
                        start_at: "31 декабря 11:00",
                        end_at: "120 минут",
                        event_image: '' 
                    }
                ];

                setTimeout(() => {
                    setEvents(mockEvents);
                    setIsLoading(false);
                }, 50);
            } catch (err) {
                console.error("Ошибка при загрузке событий:", err);
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <>
            <Header />
            <main className='events-container'>
                <h1 className='page-name'>Афиша мероприятий</h1>
                
                {events.length === 0 && !isLoading ? (
                    <div className='empty-events-wrapper'>
                        <p className='empty-events-text'>
                            На данный момент запланированных мероприятий нет. 
                            Загляните к нам позже!
                        </p>
                    </div>
                ) : (
                    <div className='events-grid'>
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default EventsPage;