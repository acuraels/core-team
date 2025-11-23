from typing import Mapping

import chromadb
from sentence_transformers import SentenceTransformer

from src.constants import ALL_BOOKS_DB as FAKE_DB_BOOKS
from src.pydantic_models import Book


class BookSearcher:
    def __init__(self):
        print("Инициализируем Book Searcher...")
        self.model = self._load_model()

        try:
            self.chroma_client = chromadb.PersistentClient(path="./chroma_storage")
            self.collection = self.chroma_client.get_or_create_collection(name="books_collection")
        except Exception as e:
            print(f"Ошибка при инициализации ChromaDB: {e}")
            exit()

        self._fill_vector_db()
        print("Инициализация Book Searcher завершена.")

    def search(self, user_query: str, exclude_ids: list[int], limit: int = 6) -> list[Book]:
        """
        :param user_query: Строка, описывающая интересы пользователя (вектор запроса).
        :param exclude_ids: ID книг для исключения из поиска (чтобы не выдавались прочитанные книги).
        :param limit: Максимальное количество кандидатов для возврата.
        :return: Список словарей с метаданными найденных книг.
        """

        query_vector = self.model.encode([user_query]).tolist()

        results = self.collection.query(
            query_embeddings=query_vector,
            n_results=limit,
        )

        found_books = []
        if results.get('metadatas') and results['metadatas'][0]:
            for meta in results['metadatas'][0]:
                if meta['id'] in exclude_ids:
                    print(f'Исключена из рекомендации книга {meta["id"]}')
                    continue
                found_books.append(self._convert_metadata_to_book(meta))
        else:
            print("ОШИБКА - не удалось найти книги")

        return found_books

    @staticmethod
    def _convert_metadata_to_book(metadata: Mapping) -> Book:
        return Book(
            isbn=int(metadata['id']),
            title=metadata['title'],
            author=metadata['author'],
            description=metadata['description'],
            image_url=metadata['image_url']
        )

    def _fill_vector_db(self):
        ids = []
        documents = []
        metadatas = []

        print("Начинаю векторизацию...")

        for book in FAKE_DB_BOOKS:
            text_to_vectorize = f"{book.author} : {book.description}"

            ids.append(str(book.isbn))
            documents.append(text_to_vectorize)

            metadatas.append({
                "id": book.isbn,
                "title": book.title,
                "author": book.author,
                "description": book.description,
                "image_url": book.image_url
            })

        embeddings = self.model.encode(documents).tolist()

        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas
        )

        print(f"Готово! Загружено {len(ids)} книг в векторную БД.")

    @staticmethod
    def _load_model():
        try:
            model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
            print("Embedding модель успешно загружена.")
        except Exception as e:
            print(f"Ошибка при загрузке Embedding модели: {e}.\n"
                  f"Программа остановлена.")
            exit()
        return model
