import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, UserCheck } from 'lucide-react';
import './EventCard.css';

// Интерфейс, который используется внутри React компонентов
export interface LibraryEvent {
  id: number;
  name: string;
  description: string;
  start_at: string;      // Отформатированная дата для отображения
  end_at: string;        // Отформатированная дата для отображения
  event_image?: string;
  registered_count: number; // Маппинг с RegistrationsCount
  visitors_count: number;   // Маппинг с VisitorsCount
}

interface EventCardProps {
  event: LibraryEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.id}`, { state: { event } });
  };

  return (
    <div className="event-card" onClick={handleClick}>
      <div className="event-image-wrapper">
        {event.event_image ? (
          <img src={event.event_image} alt={event.name} className="event-cover" />
        ) : (
          <div className="event-cover-placeholder">
            {event.name[0]}
          </div>
        )}
      </div>

      <div className="event-info">
        <h3 className="event-name">{event.name}</h3>

        <div className="event-meta">
          <div className="meta-item">
            <Calendar size={16} className="meta-icon" />
            <span>{event.start_at}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} className="meta-icon" />
            <span>{event.end_at}</span>
          </div>
        </div>

        <p className="event-description">{event.description}</p>

        <div className="event-footer">
          <div className="stat-item" title="Зарегистрировалось">
            <Users size={16} className="meta-icon" />
            <span>
              Регистраций: <b>{event.registered_count}</b>
            </span>
          </div>

          <div className="stat-item" title="Фактически пришло">
            <UserCheck size={16} className="meta-icon" />
            <span>
              Посетило: <b>{event.visitors_count}</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;