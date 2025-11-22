import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import './EventCard.css';

export interface LibraryEvent {
  id: string | number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  coverUrl?: string;
}

interface EventCardProps {
  event: LibraryEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Переходим на страницу события и передаем объект event
    navigate(`/events/${event.id}`, { state: { event } });
  };

  return (
    <div className="event-card" onClick={handleClick}>
      <div className="event-image-wrapper">
        {event.coverUrl ? (
          <img src={event.coverUrl} alt={event.title} className="event-cover" />
        ) : (
          <div className="event-cover-placeholder">
            {event.title[0]}
          </div>
        )}
      </div>

      <div className="event-info">
        <h3 className="event-title">{event.title}</h3>
        
        <div className="event-meta">
          <div className="meta-item">
            <Calendar size={16} className="meta-icon" />
            <span>{event.date}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} className="meta-icon" />
            <span>{event.time}</span>
          </div>
          {/* Место проведения можно скрыть в карточке, если тесно, но оставим */}
           <div className="meta-item">
             <MapPin size={16} className="meta-icon" />
             <span>{event.location}</span>
          </div>
        </div>

        <p className="event-description">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;