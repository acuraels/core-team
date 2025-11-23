import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BookCard from "../../components/BookCard/BookCard";

import "./BooksPage.css";
import axios from "axios";

type UserRole = "Reader" | "Librarian" | null;

interface Book {
    id: string | number;
    name: string;
    author: string;
    year?: number;
    coverUrl?: string;
    // поля для библиотекаря
    reservedCount?: number;
    totalCount?: number;
}

const BooksPage = () => {
    // Основной список
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const userId = localStorage.getItem("user_id");

    // Рекомендации
    const [recommendations, setRecommendations] = useState<Book[]>([]);
    const [isRecLoading, setIsRecLoading] = useState<boolean>(false);

    const [userRole, setUserRole] = useState<UserRole>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [favoriteIds, setFavoriteIds] = useState<(string | number)[]>([]);

    // --- 1. Читаем роль и токен ---
    useEffect(() => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("access_token");
        const role = (localStorage.getItem("user_role") as UserRole) || null;
        setIsAuthorized(!!token);
        setUserRole(role);
    }, []);

    // --- 2. Читаем избранное ---
    useEffect(() => {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem("favorite_book_ids");
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setFavoriteIds(parsed);
        } catch { /* ignore */ }
    }, []);

    // --- 3. Пишем избранное ---
    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem("favorite_book_ids", JSON.stringify(favoriteIds));
    }, [favoriteIds]);

    const isReader = isAuthorized && userRole === "Reader";
    const isLibrarian = isAuthorized && userRole === "Librarian";

    const toggleFavorite = (id: Book["id"]) => {
        setFavoriteIds((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id);
            return [...prev, id];
        });
    };

    // --- 4. Загрузка основного списка книг ---
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // В реальности здесь fetch/axios к API
                const mockBooks: Book[] = [
                    {
                        id: 1,
                        name: "1984",
                        author: "Джордж Оруэлл",
                        year: 1949,
                        coverUrl: "https://ir.ozone.ru/s3/multimedia-t/6864042989.jpg",
                        reservedCount: 2,
                        totalCount: 5
                    },
                    {
                        id: 2,
                        name: "Мастер и Маргарита",
                        author: "Михаил Булгаков",
                        year: 1967,
                        coverUrl: "https://avatars.mds.yandex.net/get-mpic/5236458/img_id5739883478692037103.jpeg/orig",
                        reservedCount: 1,
                        totalCount: 3
                    },
                    {
                        id: 3,
                        name: "Преступление и наказание",
                        author: "Фёдор Достоевский",
                        year: 1866,
                        coverUrl: "https://yandex-images.clstorage.net/D9KkI6383/b82011dm/-lTUUaVf6OzNCtRaS4fPlbcJeccl8BqA2h_G9Vi8fqgMapPbqesmkV3ICZv_kYMjCMhdQbp88jJGw1b2Tc0Csp4QRSQkK124OFvUfu82qhDzqIynxDDKoq0NNLY_vv3b2sjQOqnPM5SZGY0vKQaCAV9f6PRtusb35NbVMwrb1VUZ5eZFc7pKnD-rpFh4E44Fds65xCdiGII-nHZ2nD1Ne_oIg4lLn8HFuf8OrRglV2Muz0snPus012ZXp4PZaUX0iVcWVmFr6d1N-gbqyEPuFpefG1Ulo2gx7V03tL79X1g6CIDJWe1w9bsfjzwJdVeBPo7LJf0q5fVH5SUy2vvWR9gU1VYRSjndLlvWyXoAHtZ23IiWJlNLUNyuZ_aO_i97GcrCymvvIbeaDm7tSpbXY4xP6Kb96EXWRzZEkSq6NRX6FbfEQ-mLfo5Kp1moMe5nJ71KlxVB-HM9_qXWLKyOOljqAOm7b2LH-85O7PmU9iGOT-vHHEnEhge21TL668UWGaRVdKFryV3_i0b52EHd9MZcCIW1cXgAHYwkJFx_XVoomAF6Os6hVApuzi1J9xbBzl8atN8I5vUGRxbS60l0xet3ZaZDW2hNb5rmC0nQX-dG7BtEJ6P6EUzPBrZPT05Ze7jQK5nNIZdILD2uW4WnUD-MK8XPCncXBYbVsAhJddd6dQQU0ooqvV54hvpLIK-3NP0JRSVA6ADcvFQm3Bw-q9ib4EpLDPFHWF4PHqoXhLNdTQjXj-q2B9T2ZIFbGVSki9Z115C7a--dWbcp-tM_91etSDQ1ocrib621ty6O3Ck7mjKaGr-DNem8T3xaBRZxr91LBTxZJMZE1YQiamhFJ6ulJxYjaHidn_g2WhujflenHvoURiNJcH7fp9asPJ6bCFniici_EsWZD_8-mXZXAQ3fCsevSHclxlYUkWjKR4UoBsfWIus5z094hep6w541Vw8pFSfxWUE_nbRGjW5OA",
                        reservedCount: 0,
                        totalCount: 4
                    },
                    {
                        id: 4,
                        name: "Трудно быть богом",
                        author: "Аркадий и Борис Стругацкие",
                        year: 1964,
                        coverUrl: "https://main-cdn.sbermegamarket.ru/big1/hlr-system/1543569/100023064125b0.jpg",
                        reservedCount: 1,
                        totalCount: 2
                    },
                    {
                        id: 5,
                        name: "Война и мир",
                        author: "Лев Толстой",
                        year: 1869,
                        coverUrl: "https://avatars.mds.yandex.net/get-mpic/4362876/2a0000019205234fe3321bd278f4279c5af0/orig",
                        reservedCount: 3,
                        totalCount: 7
                    },
                    {
                        id: 6,
                        name: "Три товарища",
                        author: "Эрих Мария Ремарк",
                        year: 1936,
                        coverUrl: "https://yandex-images.clstorage.net/D9KkI6383/b82011dm/-lTUUaVf6OzNCtRaS4fPlbcJeccl8BqA2h_G9Vi8fqgMapPbqesm4V24SQs_gYMjCMhdQbp88jJmtibjHdgSgu6V8PFB_iit6Jvx23_mqjWjCLynxDDKoq0NNLY_vv3b2sjQOqnPM5SZGY0vKQaCAV9f6PRtusb35NbVMwrb1VUZ5eZFc7pKnD-rpFh4E44Fds65xCdiGII-nHZ2nD1Ne_oIg4lLn8HFuf8OrRglV2Muz0snPus012ZXp4PZaUX0iVcWVmFr6d1N-gbqyEPuFpefG1Ulo2gx7V03tL79X1g6CIDJWe1w9bsfjzwJdVeBPo7LJf0q5fVH5SUy2vvWR9gU1VYRSjndLlvWyXoAHtZ23IiWJlNLUNyuZ_aO_i97GcrCymvvIbeaDm7tSpbXY4xP6Kb96EXWRzZEkSq6NRX6FbfEQ-mLfo5Kp1moMe5nJ71KlxVB-HM9_qXWLKyOOljqAOm7b2LH-85O7PmU9iGOT-vHHEnEhge21TL668UWGaRVdKFryV3_i0b52EHd9MZcCIW1cXgAHYwkJFx_XVoomAF6Os6hVApuzi1J9xbBzl8atN8I5vUGRxbS60l0xet3ZaZDW2hNb5rmC0nQX-dG7BtEJ6P6EUzPBrZPT05Ze7jQK5nNIZdILD2uW4WnUD-MK8XPCncXBYbVsAhJddd6dQQU0ooqvV54hvpLIK-3NP0JRSVA6ADcvFQm3Bw-q9ib4EpLDPFHWF4PHqoXhLNdTQjXj-q2B9T2ZIFbGVSki9Z115C7a--dWbcp-tM_91etSDQ1ocrib621ty6O3Ck7mjKaGr-DNem8T3xaBRZxr91LBTxZJMZE1YQiamhFJ6ulJxYjaHidn_g2WhujflenHvoURiNJcH7fp9asPJ6bCFniici_EsWZD_8-mXZXAQ3fCsevSHclxlYUkWjKR4UoBsfWIus5z094hep6w541Vw8pFSfxWUE_nbRGjW5OA",
                        reservedCount: 0,
                        totalCount: 2
                    },
                    {
                        id: 7,
                        name: "Над пропастью во ржи",
                        author: "Джером Д. Сэлинджер",
                        year: 1951,
                        coverUrl: "https://i.pinimg.com/736x/88/c0/4b/88c04bc1c2ef53afbebc57f7e0ab659e.jpg",
                        reservedCount: 1,
                        totalCount: 3
                    },
                    {
                        id: 8,
                        name: "Доктор Живаго",
                        author: "Борис Пастернак",
                        year: 1957,
                        coverUrl: "https://imo02.my-shop.ru/products486/4853820/cover.jpg/500-0",
                        reservedCount: 0,
                        totalCount: 1
                    },
                    {
                        id: 9,
                        name: "Отцы и дети",
                        author: "Иван Тургенев",
                        year: 1862,
                        coverUrl: "https://yandex-images.clstorage.net/D9KkI6383/b82011dm/-lTUUaVf6OzNCtRaS4fPlbcJeccl8BqA2h_G9Vi8fqgMapPbqesmge2oKYsP8YaTzb6o1Pps4oLTAwOGfd3Cov4AgCE0vp1pTbqUGx5D3mVmTmulJwJ5I63dtNaOrZ7pqPoTX9j-gCc8ny6cykWkwDyd6gRs-ZUk1CSkQ0t5JfbpdEfUMbgKXQxbFLhLID03tG74NGXC2qAdfZQW3R58uVqrM7lbfLEE6f1fDGmW95HOvWiFHklGlkSFNPG7ajcnSjU1hZMKug1sSPXp6bE_9sTdK_UkAPhgD15UFt5ebsvrmzFZ2u2gVOkfT03plDRQH59JN5z4RQTXNmWyeGpHBpo1ViRDKQhOnIgUqnpyPAbnvBoGdELIY399d9ScXVzJutkQSDs847dp_f2Myhc0kr-8SeT9W7VFNGRHsxr4FaUolvY1Mrnaf2w5Rcu4cw8UVJ_7VrZiajHePDb0Xn6MSfmpcYgbPVC1SL__jMl21TM-7AlkbPhlFMRnpAL4SPcnarWH9NMZqg9fqqQq-mGvJNTs2yQ3kBriDVxGhl_tDeg6OoAom_zg1qhfv5w4BRZyHJ8Ila8YdLZ1tFbRyJoVF8ulF-Vz6zue3bkkmumgPfZW_YpnFQIJ0h5fFaaOvK7ruvnCamh_8qQZzk5PCXQGcI19C1Rsepe2dKbH06kohMaJVSYHExo5bi3pVov7oT8VROwaFEeSmoFurbaFvt18Kmop0hhazwM2Oi0sjipmRpBMbdok3UvE5lXVNnDY68b3yAflJiLJiJ29qTXbutAv9GYOqQWmA2gTjC9VhGwNLZkYW2P6Gq3zJKjv3h5ptPUj3qxKBz3o9ZdEVhYDiip1JNt154ejumnt_AnFaAjwXHblnLh3tGLqoc6dZke8Hv-ZiasTSarvMFfpn3wcKHZmMo1PyIStW_c1RvSVoGrqdKeaJzcHEAoIjRxrNXnb8T2k9a35Nafyy_MeDAWlnM9eo",
                        reservedCount: 2,
                        totalCount: 4
                    },
                ];

                setTimeout(() => {
                    setBooks(mockBooks);
                    setIsLoading(false);
                }, 50);
            } catch (err) {
                console.error("Ошибка при загрузке списка книг:", err);
                setIsLoading(false);
            }
        };
        fetchBooks();
    }, []);

    useEffect(() => {
        if (!isReader) return;

        const fetchRecommendations = async () => {
            setIsRecLoading(true);
            try {
                const response = await axios.get<Book[]>(`http://localhost:8001/api/v1/recommend/${userId}`);
                const books = response.data;

                console.log("Рекомендации получены:", books);
            } catch (err) {
                console.error("Ошибка при загрузке рекомендаций:", err);
            }
        }
        fetchRecommendations();
    }, [isReader]);

    return (
        <>
            <Header />
            <main className="books-container">
                {isReader && (
                    <section className="recommendations-section">
                        <h2 className="page-title-2" style={{ marginTop: '15px' }}>
                            Персональные рекомендации
                        </h2>
                        
                        {isRecLoading ? (
                            <div className="empty-books-wrapper" style={{ minHeight: '200px' }}>
                                <p className="empty-books-text">ИИ подбирает книги для вас...</p>
                            </div>
                        ) : recommendations.length > 0 ? (
                            <div className="books-list">
                                {recommendations.map((book) => (
                                    <BookCard
                                        key={book.id}
                                        book={book}
                                        mode="reader"
                                        showFavorite={true}
                                        isFavorite={favoriteIds.includes(book.id)}
                                        onToggleFavorite={() => toggleFavorite(book.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                             <p className="empty-books-text" style={{ marginBottom: '40px' }}>Нет персональных рекомендаций.</p>
                        )}
                        <div style={{ width: '100%', height: '1px', background: '#e5e7eb' }} />
                    </section>
                )}
                <h1 className="page-title-2">
                    {isLibrarian ? "Учёт книг" : "Каталог библиотеки"}
                </h1>

                {isLoading ? (
                    <div className="empty-books-wrapper">
                        <p className="empty-books-text">Загружаем каталог...</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="empty-books-wrapper">
                        <p className="empty-books-text">
                            К сожалению, в данный момент ни одной книги нет в наличии.
                        </p>
                    </div>
                ) : (
                    <div className="books-list">
                        {books.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                mode={
                                    isLibrarian
                                        ? "librarian"
                                        : isReader
                                            ? "reader"
                                            : "public"
                                }
                                showFavorite={isReader}
                                isFavorite={isReader && favoriteIds.includes(book.id)}
                                onToggleFavorite={
                                    isReader
                                        ? () => toggleFavorite(book.id)
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default BooksPage;