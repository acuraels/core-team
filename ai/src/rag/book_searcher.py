from typing import Any

import chromadb

from src.rag.embedding_model import get_embedding_model


class BookSearcher:
    def __init__(self):
        self.model = get_embedding_model()

        try:
            self.chroma_client = chromadb.PersistentClient(path="./chroma_storage")
            self.collection = self.chroma_client.get_collection(name="books_collection")
        except Exception as e:
            print(f"Ошибка при инициализации ChromaDB: {e}")
            exit()

        print("Book Searcher инициализирован")

    def search(self, user_query: str, limit: int = 5) -> list[dict[str, Any]]:
        """
        :param user_query: Строка, описывающая интересы пользователя (вектор запроса).
        :param limit: Максимальное количество кандидатов для возврата.
        :return: Список словарей с метаданными найденных книг.
        """
        query_vector = self.model.encode([user_query]).tolist()

        results = self.collection.query(
            query_embeddings=query_vector,
            n_results=limit
        )

        found_books = []
        if results.get('metadatas') and results['metadatas'][0]:
            for meta in results['metadatas'][0]:
                found_books.append(meta)
        else:
            print("ОШИБКА - не удалось найти книги")

        return found_books
