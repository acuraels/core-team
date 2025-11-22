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
                        title: "Встреча с автором: Алексей Иванов",
                        description: "Уникальная возможность пообщаться с автором бестселлеров, обсудить новинки литературы и получить автограф.",
                        date: "24 ноября",
                        time: "18:00",
                        location: "Читальный зал №1",
                        coverUrl: '' // Оставим пустым для проверки плейсхолдера
                    },
                    {
                        id: 2,
                        title: "Мастер-класс по реставрации книг",
                        description: "Научимся базовым техникам восстановления старых переплетов и ухода за домашней библиотекой.",
                        date: "26 ноября",
                        time: "14:00",
                        location: "Мастерская",
                        coverUrl: '' 
                    },
                    {
                        id: 3,
                        title: "Лекция: История Екатеринбурга",
                        description: "Погружение в исторические тайны города с ведущим краеведом области.",
                        date: "1 декабря",
                        time: "19:00",
                        location: "Конференц-зал",
                        coverUrl: '' 
                    },
                    {
                        id: 4,
                        title: "Детский книжный клуб",
                        description: "Читаем сказки и обсуждаем их с самыми маленькими посетителями.",
                        date: "3 декабря",
                        time: "11:00",
                        location: "Детская зона",
                        coverUrl: '' 
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
                <h1 className='page-title'>Афиша мероприятий</h1>
                
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