import React from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Добавляем иконку UserCheck
import { Calendar, Clock, Users, UserCheck } from 'lucide-react';
import './EventCard.css';

export interface LibraryEvent {
  id: string | number;
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  event_image?: string;
  registered_count?: number;
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
            <span>{event.start_at}</span>
          </div>
        </div>

        <p className="event-description">{event.description}</p>

        {/* 3. Обновленный футер с двумя метриками */}
        <div className="event-footer">
            <div className="stat-item" title="Зарегистрировалось">
                <Users size={16} className="meta-icon" />
                <span>
                    Регистраций: <b>{event.registered_count || 0}</b>
                </span>
            </div>
            
            <div className="stat-item" title="Фактически пришло">
                <UserCheck size={16} className="meta-icon" />
                <span>
                    Посетило: <b>{0}</b>
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;