from logging import getLogger

from src.book_searcher import BookSearcher

logger = getLogger(__name__)


class RecommendationService:
    def __init__(self):
        logger.info("Инициализируем RecommendationService...")
        self._book_searcher = BookSearcher()
        # self._giga_chat = GigaChatService()
        logger.info("Инициализация RecommendationService завершена...")

    @staticmethod
    def get_favourite_books(user_id: int) -> list[dict[str, str]]:
        # TODO: адекватно получать любимые книги (из бд)
        return [
            {
                "title": "Дюна",
                "description": "Политическая и философская борьба за контроль над пустынной планетой Арракис и её уникальным ресурсом.",
                "author": "Фрэнк Герберт"
            },
            {
                "title": "Марсианин",
                "description": "Инженер-ботаник выживает в суровых условиях Марса после аварии и пытается вернуться домой.",
                "author": "Энди Вейер"
            },
            {
                "title": "Космическая одиссея 2001",
                "description": "Экспедиция к Юпитеру, искусственный интеллект и столкновение человечества с загадочной инопланетной силой.",
                "author": "Артур Кларк"
            }
        ]

    @staticmethod
    def get_search_query(favourite_books: list[dict[str, str]]) -> str:
        search_query = ""
        for book in favourite_books:
            search_query += f" - Название: {book['title']}, Автор: {book['author']}, Описание: {book['description']}\n"
        return search_query

    def get_recommendation(self, user_id: int):
        favourite_books = self.get_favourite_books(user_id)
        search_query = self.get_search_query(favourite_books)
        # TODO: добавить exlude_ids
        candidates = self._book_searcher.search(search_query, [2, 14, 15])

        candidates_text = "\n".join(
            [f"{book['title']} ({book['author']}): {book['description']}" for book in candidates]
        )

        return candidates
