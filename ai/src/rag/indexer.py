import chromadb

from src.rag.embedding_model import get_embedding_model

model = get_embedding_model()

chroma_client = chromadb.PersistentClient(path="./chroma_storage")
collection = chroma_client.get_or_create_collection(name="books_collection")

FAKE_DB_BOOKS = [
    {"id": 1, "title": "Мастер и Маргарита", "author": "Булгаков", "genre": "Фантастика/Классика",
     "description": "Сатира на советскую жизнь и мистика, кот Бегемот."},
    {"id": 2, "title": "Дюна", "author": "Фрэнк Герберт", "genre": "Sci-Fi",
     "description": "Эпическая сага о политике и экологии на пустынной планете Арракис."},
    {"id": 3, "title": "1984", "author": "Джордж Оруэлл", "genre": "Антиутопия",
     "description": "Мрачная история о тоталитарном государстве и Большом Брате."},
    {"id": 4, "title": "Властелин Колец", "author": "Толкин", "genre": "Фэнтези",
     "description": "Путешествие хоббитов ради спасения мира от зла."},
    # ... и так далее
]


def fill_vector_db():
    ids = []
    documents = []
    metadatas = []

    print("Начинаю векторизацию...")

    for book in FAKE_DB_BOOKS:
        text_to_vectorize = (
            f"Заголовок: {book['title']}. "
            f"Автор: {book['author']}. "
            f"Описание: {book['description']}"
        )

        ids.append(str(book['id']))
        documents.append(text_to_vectorize)

        metadatas.append({
            "id": book['id'],
            "title": book['title'],
            "author": book['author'],
            "description": book['description']
        })

    embeddings = model.encode(documents).tolist()

    collection.add(
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas
    )

    print(f"Готово! Загружено {len(ids)} книг в векторную БД.")
