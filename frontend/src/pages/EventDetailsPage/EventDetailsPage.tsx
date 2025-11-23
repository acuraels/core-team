import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Edit, UserPlus, X, Upload, Check } from 'lucide-react'; // Добавил Check
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import type { LibraryEvent } from '../../components/EventCard/EventCard';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userRole = localStorage.getItem('user_role'); // Получаем роль пользователя

    // Данные события
    const event = location.state?.event as LibraryEvent;

    // --- Стейты для модальных окон ---
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // --- Стейт для статуса регистрации текущего пользователя (Reader) ---
    const [isUserRegistered, setIsUserRegistered] = useState(false);

    // --- Стейт для формы редактирования ---
    const [editFormData, setEditFormData] = useState<Partial<LibraryEvent>>({});

    // --- Логика Регистрации читателя (Для библиотекаря) ---
    const handleRegisterReader = () => {
        setIsRegisterModalOpen(true);
    };

    // --- Логика Самостоятельной записи (Для читателя) ---
    const handleSelfRegister = () => {
        // Здесь будет логика POST запроса: /api/events/{id}/register
        console.log(`Пользователь записался на событие: ${event.name}`);
        setIsUserRegistered(true);
        // Можно добавить toast уведомление об успехе
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Создаем временную URL для предпросмотра
            const imageUrl = URL.createObjectURL(file);

            setEditFormData(prev => ({
                ...prev,
                event_image: imageUrl
            }));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleCloseRegisterModal = () => {
        setIsRegisterModalOpen(false);
    };

    const handleConfirmRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Регистрация читателя подтверждена");
        setIsRegisterModalOpen(false);
    };

    // --- Логика Редактирования события ---
    const handleEditEvent = () => {
        // Заполняем форму текущими данными при открытии
        setEditFormData({
            name: event.name,
            description: event.description,
            start_at: event.start_at,
            end_at: event.end_at,
            event_image: event.event_image
        });
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Сохраненные данные события:", editFormData);
        // Тут будет логика отправки PUT запроса на сервер
        setIsEditModalOpen(false);
    };

    // Обработчик изменений в полях формы редактирования
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
                    <div className="event-details-image-col">
                        <div className="event-details-image-wrapper">
                            {event.event_image ? (
                                <img src={event.event_image} alt={event.name} className="event-details-cover" />
                            ) : (
                                <div className="event-details-placeholder">
                                    {event.name[0]}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="event-details-info-col">
                        <h1 className="event-details-title">{event.name}</h1>

                        <div className="event-details-meta-grid">
                            <div className="event-meta-box">
                                <Calendar className="event-meta-icon" />
                                <div>
                                    <span className="meta-label">Начало</span>
                                    <p className="meta-value">{event.start_at}</p>
                                </div>
                            </div>
                            <div className="event-meta-box">
                                <Clock className="event-meta-icon" />
                                <div>
                                    <span className="meta-label">Длительность</span>
                                    <p className="meta-value">{event.end_at}</p>
                                </div>
                            </div>
                        </div>

                        {/* --- Блок действий для БИБЛИОТЕКАРЯ --- */}
                        {userRole === "Librarian" && (
                            <div className="admin-actions-block">
                                <button className="action-btn edit-btn" onClick={handleEditEvent}>
                                    <Edit size={18} />
                                    Редактировать
                                </button>
                                <button className="action-btn register-reader-btn" onClick={handleRegisterReader}>
                                    <UserPlus size={18} />
                                    Записать читателя
                                </button>
                            </div>
                        )}

                        {/* --- Блок действий для ЧИТАТЕЛЯ (Новый код) --- */}
                        {userRole === "Reader" && (
                            <div className="reader-actions-block" style={{ marginTop: '20px' }}>
                                {!isUserRegistered ? (
                                    <button
                                        className="action-btn"
                                        onClick={handleSelfRegister}
                                        style={{
                                            backgroundColor: '#2563eb',
                                            color: 'white',
                                            width: '40%',
                                            justifyContent: 'center',
                                            padding: '12px'
                                        }}
                                    >
                                        <UserPlus size={20} style={{ marginRight: '8px' }} />
                                        Зарегистрироваться на мероприятие
                                    </button>
                                ) : (
                                    <button
                                        className="action-btn"
                                        disabled
                                        style={{
                                            backgroundColor: '#10b981', // Зеленый цвет успеха
                                            color: 'white',
                                            width: '30%',
                                            justifyContent: 'center',
                                            padding: '12px',
                                            cursor: 'default',
                                            opacity: 1
                                        }}
                                    >
                                        <Check size={20} style={{ marginRight: '8px' }} />
                                        Вы записаны
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="event-details-description">
                            <h3>О мероприятии</h3>
                            <p>{event.description}</p>
                        </div>
                    </div>
                </div>

                {/* Модалка записи читателя (только для библиотекаря) */}
                {isRegisterModalOpen && (
                    <div className="modal-overlay" onClick={handleCloseRegisterModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Запись участника</h3>
                                <button className="modal-close-btn" onClick={handleCloseRegisterModal}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleConfirmRegistration}>
                                <div className="modal-body">
                                    <label htmlFor="readerId" className="input-label">
                                        Номер читательского билета
                                    </label>
                                    <input
                                        type="text"
                                        id="readerId"
                                        className="modal-input"
                                        placeholder="Введите номер"
                                        autoFocus
                                        minLength={6}
                                        maxLength={6}
                                        required
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="modal-btn cancel-btn" onClick={handleCloseRegisterModal}>
                                        Отмена
                                    </button>
                                    <button type="submit" className="modal-btn submit-btn">
                                        Зарегистрировать
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Модалка редактирования */}
                {isEditModalOpen && (
                    <div className="modal-overlay" onClick={handleCloseEditModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Редактирование события</h3>
                                <button className="modal-close-btn" onClick={handleCloseEditModal}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEvent}>
                                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                                    <div>
                                        <label className="input-label">Название</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name || ''}
                                            onChange={handleEditChange}
                                            className="modal-input"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label">Описание</label>
                                        <textarea
                                            name="description"
                                            value={editFormData.description || ''}
                                            onChange={handleEditChange}
                                            className="modal-input"
                                            rows={4}
                                            style={{ resize: 'vertical', fontFamily: 'inherit' }}
                                            required
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label className="input-label">Начало</label>
                                            <input
                                                type="text"
                                                name="start_at"
                                                value={editFormData.start_at || ''}
                                                onChange={handleEditChange}
                                                className="modal-input"
                                                placeholder="Например: 24 ноября 18:00"
                                                required
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className="input-label">Конец (End At)</label>
                                            <input
                                                type="text"
                                                name="end_at"
                                                value={editFormData.end_at || ''}
                                                onChange={handleEditChange}
                                                className="modal-input"
                                                placeholder="Например: 24 ноября 20:00"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">Изображение мероприятия</label>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                        />
                                        <div className="file-upload-container">
                                            <button
                                                type="button"
                                                className="upload-btn"
                                                onClick={triggerFileInput}
                                            >
                                                <Upload size={18} />
                                                {editFormData.event_image ? 'Изменить фото' : 'Загрузить фото'}
                                            </button>
                                            {editFormData.event_image && (
                                                <div className="image-preview-mini">
                                                    <img src={editFormData.event_image} alt="Preview" />
                                                    <span className="file-name">Изображение выбрано</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="modal-btn cancel-btn" onClick={handleCloseEditModal}>
                                        Отмена
                                    </button>
                                    <button type="submit" className="modal-btn submit-btn">
                                        Сохранить
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
            <Footer />
        </>
    );
};

export default EventDetailsPage;