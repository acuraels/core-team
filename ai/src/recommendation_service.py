from src.book_searcher import BookSearcher
from src.constants import ALL_BOOKS_DB
from src.pydantic_models import Book
from src.pydantic_models import RecommendationResponse
from src.pydantic_models import map_books_to_ts

class RecommendationService:
    def __init__(self):
        print("Инициализируем RecommendationService...")
        self._book_searcher = BookSearcher()
        # self._giga_chat = GigaChatService()
        print("Инициализация RecommendationService завершена")

    @staticmethod
    def get_favourite_books(user_id: str) -> list[Book]:
        # TODO: адекватно получать любимые книги (из бд)
        return [ALL_BOOKS_DB[2]]

    @staticmethod
    def get_search_query(favourite_books: list[Book]) -> str:
        search_query = ""
        for book in favourite_books:
            search_query += f"{book.author} : {book.description}\n"
        return search_query

    @staticmethod
    def get_ids_for_exclude(books: list[Book]) -> list[int]:
        ids = []
        for book in books:
            ids.append(book.isbn)
        return ids

    def get_recommendation(self, user_id: str) -> list[dict]:
        favourite_books = self.get_favourite_books(user_id)
        search_query = self.get_search_query(favourite_books)
        exclude_ids = self.get_ids_for_exclude(favourite_books)
        candidates = self._book_searcher.search(search_query, exclude_ids)
        return map_books_to_ts(candidates)
