import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './BookDetailsPage.css';

const BookDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const book = location.state?.book;

    if (!book) {
        return (
            <>
                <Header />
                <main className="book-details-container">
                    <h2>Книга не найдена</h2>
                    <button onClick={() => navigate(-1)}>Вернуться назад</button>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="book-details-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Назад к каталогу
                </button>
                
                <div className="book-details-content">
                    <div className="book-details-image-wrapper">
                        {book.coverUrl ? (
                            <img src={book.coverUrl} alt={book.name} className="book-details-cover" />
                        ) : (
                            <div className="book-details-placeholder">
                                {book.name[0]}
                            </div>
                        )}
                    </div>

                    <div className="book-details-info">
                        <h1 className="book-details-title">{book.name}</h1>
                        <p className="book-details-author">Автор: <span>{book.author}</span></p>
                        <p className="book-details-year">Год издания: {book.year}</p>
                        
                        <div className="book-details-description">
                            <h3>Описание</h3>
                            <p>
                                Здесь должно быть описание книги. Так как мы используем моковые данные, 
                                представьте здесь увлекательную аннотацию к произведению "{book.name}", 
                                которая побудит читателя взять эту книгу в библиотеке.
                            </p>
                        </div>

                        {/* <button className="booking-button">Забронировать книгу</button> */}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default BookDetailsPage;