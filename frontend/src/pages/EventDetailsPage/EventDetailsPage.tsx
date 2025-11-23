import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Edit, UserPlus, X, Upload, Check } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import type { LibraryEvent } from '../../components/EventCard/EventCard';
// @ts-ignore
import axiosInstance from "../../utils/axiosInstance";
import './EventDetailsPage.css';

const EventDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userRole = localStorage.getItem('user_role');

    // Данные события (end_at здесь уже содержит "XX минут")
    const event = location.state?.event as LibraryEvent;

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUserRegistered, setIsUserRegistered] = useState(false);
    
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        startAt: '', 
        endAt: '',
        eventImage: ''
    });

    // --- Логика Записи (Читатель) ---
    const handleSelfRegister = async () => {
        try {
            await axiosInstance.post(`Events/${event.id}/register`);
            setIsUserRegistered(true);
        } catch (error: any) {
            if (error.response?.status !== 401) {
                alert("Не удалось записаться. Возможно, вы уже записаны.");
            }
        }
    };

    // --- Логика Редактирования (Библиотекарь) ---
    const handleEditEvent = () => {
        // Мы не можем восстановить точную дату окончания из "120 минут",
        // поэтому поля дат оставляем пустыми или заполняем только то, что можем.
        setEditFormData({
            name: event.name,
            description: event.description,
            startAt: '', // Пользователю придется выбрать дату заново
            endAt: '',   // Пользователю придется выбрать дату заново
            eventImage: event.event_image || ''
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name: editFormData.name,
                description: editFormData.description,
                startAt: new Date(editFormData.startAt).toISOString(),
                endAt: new Date(editFormData.endAt).toISOString(),
                eventImage: editFormData.eventImage
            };

            await axiosInstance.post('Events', payload);
            setIsEditModalOpen(false);
            navigate('/events');
        } catch (error) {
            console.error("Ошибка сохранения:", error);
            alert("Ошибка при сохранении события");
        }
    };

    const handleRegisterReader = () => setIsRegisterModalOpen(true);
    const handleCloseRegisterModal = () => setIsRegisterModalOpen(false);
    const handleCloseEditModal = () => setIsEditModalOpen(false);

    const handleConfirmRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        setIsRegisterModalOpen(false);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setEditFormData(prev => ({ ...prev, eventImage: imageUrl }));
        }
    };
    const triggerFileInput = () => fileInputRef.current?.click();

    if (!event) return null;

    return (
        <>
            <Header />
            <main className="event-details-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} /> Назад к афише
                </button>

                <div className="event-details-content">
                    <div className="event-details-image-col">
                        <div className="event-details-image-wrapper">
                            {event.event_image ? (
                                <img src={event.event_image} alt={event.name} className="event-details-cover" />
                            ) : (
                                <div className="event-details-placeholder">{event.name[0]}</div>
                            )}
                        </div>
                    </div>

                    <div className="event-details-info-col">
                        <h1 className="event-details-title">{event.name}</h1>
                        <div className="event-details-meta-grid">
                            <div className="event-meta-box">
                                <Calendar className="event-meta-icon" />
                                <div><span className="meta-label">Начало</span><p className="meta-value">{event.start_at}</p></div>
                            </div>
                            <div className="event-meta-box">
                                <Clock className="event-meta-icon" />
                                {/* ИЗМЕНЕНО: Label теперь Длительность, а значение - минуты */}
                                <div><span className="meta-label">Длительность</span><p className="meta-value">{event.end_at}</p></div>
                            </div>
                        </div>

                        {userRole === "Librarian" && (
                            <div className="admin-actions-block">
                                <button className="action-btn edit-btn" onClick={handleEditEvent}>
                                    <Edit size={18} /> Редактировать
                                </button>
                                <button className="action-btn register-reader-btn" onClick={handleRegisterReader}>
                                    <UserPlus size={18} /> Записать читателя
                                </button>
                            </div>
                        )}

                        {userRole === "Reader" && (
                            <div className="reader-actions-block" style={{ marginTop: '20px' }}>
                                {!isUserRegistered ? (
                                    <button 
                                        className="action-btn" 
                                        onClick={handleSelfRegister}
                                        style={{ backgroundColor: '#2563eb', color: 'white', justifyContent: 'center', padding: '12px' }}
                                    >
                                        <UserPlus size={20} style={{ marginRight: '8px' }} />
                                        Зарегистрироваться на мероприятие
                                    </button>
                                ) : (
                                    <button 
                                        className="action-btn" 
                                        disabled 
                                        style={{ backgroundColor: '#10b981', color: 'white', justifyContent: 'center', padding: '12px', cursor: 'default', opacity: 1 }}
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

                {/* Модалка редактирования */}
                {isEditModalOpen && (
                    <div className="modal-overlay" onClick={handleCloseEditModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Создание события (Edit Mode)</h3>
                                <button className="modal-close-btn" onClick={handleCloseEditModal}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSaveEvent}>
                                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div>
                                        <label className="input-label">Название</label>
                                        <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} className="modal-input" required />
                                    </div>
                                    <div>
                                        <label className="input-label">Описание</label>
                                        <textarea name="description" value={editFormData.description} onChange={handleEditChange} className="modal-input" rows={4} style={{ resize: 'vertical' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label className="input-label">Начало</label>
                                            <input type="datetime-local" name="startAt" value={editFormData.startAt} onChange={handleEditChange} className="modal-input" required />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className="input-label">Конец</label>
                                            <input type="datetime-local" name="endAt" value={editFormData.endAt} onChange={handleEditChange} className="modal-input" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="input-label">Изображение</label>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                                        <div className="file-upload-container">
                                            <button type="button" className="upload-btn" onClick={triggerFileInput}>
                                                <Upload size={18} /> {editFormData.eventImage ? 'Изменить фото' : 'Загрузить фото'}
                                            </button>
                                            {editFormData.eventImage && (
                                                <div className="image-preview-mini">
                                                    <img src={editFormData.eventImage} alt="Preview" />
                                                    <span className="file-name">Выбрано</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="modal-btn cancel-btn" onClick={handleCloseEditModal}>Отмена</button>
                                    <button type="submit" className="modal-btn submit-btn">Сохранить</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                
                {/* Модалка записи читателя */}
                {isRegisterModalOpen && (
                    <div className="modal-overlay" onClick={handleCloseRegisterModal}>
                         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Запись участника</h3>
                                <button className="modal-close-btn" onClick={handleCloseRegisterModal}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleConfirmRegistration}>
                                <div className="modal-body">
                                    <label htmlFor="readerId" className="input-label">Номер читательского билета</label>
                                    <input type="text" id="readerId" className="modal-input" placeholder="Введите номер" required />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="modal-btn cancel-btn" onClick={handleCloseRegisterModal}>Отмена</button>
                                    <button type="submit" className="modal-btn submit-btn">Зарегистрировать</button>
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