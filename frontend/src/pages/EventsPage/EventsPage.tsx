import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import EventCard, { type LibraryEvent } from '../../components/EventCard/EventCard';
// @ts-ignore
import axiosInstance from "../../utils/axiosInstance";
import './EventsPage.css';

const EventsPage = () => {
    const [events, setEvents] = useState<LibraryEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Форматирование даты: "{число} {месяц} {время}"
    const formatDate = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = (startIso: string, endIso: string) => {
        const start = new Date(startIso).getTime();
        const end = new Date(endIso).getTime();
        const diffMs = end - start;
        const minutes = Math.round(diffMs / 60000);
        return `${minutes} минут`;
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get('Events');
                const data = response.data;

                const mappedEvents: LibraryEvent[] = data.map((e: any) => ({
                    id: e.id,
                    name: e.name,
                    description: e.description,
                    start_at: formatDate(e.startAt),
                    
                    // !!! ЗДЕСЬ ИЗМЕНЕНИЕ !!!
                    // Вместо форматированной даты конца, сохраняем разницу в минутах
                    end_at: calculateDuration(e.startAt, e.endAt), 
                    
                    event_image: e.eventImage,
                    registered_count: e.registrationsCount,
                    visitors_count: e.visitorsCount
                }));

                setEvents(mappedEvents);
            } catch (err) {
                console.error("Ошибка при загрузке событий:", err);
            } finally {
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