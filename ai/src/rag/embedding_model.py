from sentence_transformers import SentenceTransformer

try:
    EMBEDDING_MODEL = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    print("Embedding модель успешно загружена.")
except Exception as e:
    print(f"Ошибка при загрузке Embedding модели: {e}.\n"
          f"Программа остановлена.")
    exit()


def get_embedding_model():
    """Функция-обертка (синглтон) для доступа к модели."""
    return EMBEDDING_MODEL
