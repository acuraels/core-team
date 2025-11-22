import os
from typing import List

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from gigachat import GigaChat

from src.constants import ALL_BOOKS_DB
from src.api import router as main_router

load_dotenv()
app = FastAPI(title="Book Recommender AI")
GIGACHAT_API_KEY = os.getenv("GIGACHAT_API_KEY")

app.include_router(
    main_router,
    prefix="/api/v1/recommend",
)

# ИМИТАЦИЯ "ИЗБРАННОГО" У ПОЛЬЗОВАТЕЛЕЙ
# Ключ - ID пользователя, Значение - список ID любимых книг
USER_FAVORITES_MOCK = {
    1: [2, 6],  # Любит "Дюну" и "Автостопом по галактике" (Явно фанат космоса/Sci-Fi)
    2: [4, 7],  # Любит "Властелин Колец" и "Гарри Поттера" (Фанат фэнтези)
    3: [1, 3],  # Любит "Мастера и Маргариту" и "1984" (Любит классику и социальные темы)
}


def get_user_history_books(user_id: int) -> List[dict]:
    """Находит полные объекты книг, которые лайкнул пользователь"""
    fav_ids = USER_FAVORITES_MOCK.get(user_id, [])
    # Собираем объекты книг из общей базы по их ID
    return [book for book in ALL_BOOKS_DB if book['id'] in fav_ids]


def get_available_books_for_recommendation(user_id: int) -> List[dict]:
    """Возвращает книги, которые пользователь ЕЩЕ НЕ читал (исключаем избранное)"""
    fav_ids = USER_FAVORITES_MOCK.get(user_id, [])
    return [book for book in ALL_BOOKS_DB if book['id'] not in fav_ids]


# === 3. Логика GigaChat ===

def ask_gigachat(favorites: list[dict], available: list[dict]) -> str:
    # Превращаем списки в текст
    fav_text = "\n".join([f"- {b['title']} (Автор: {b['author']}, Описание: {b['description']})" for b in favorites])
    avail_text = "\n".join([f"ID {b['id']}: {b['title']} ({b['genre']}) - {b['description']}" for b in available])

    prompt = (
        f"Ты — профессиональный библиотекарь и рекомендательная система.\n\n"
        f"ШАГ 1. Проанализируй вкус пользователя на основе его любимых книг:\n{fav_text}\n\n"
        f"ШАГ 2. Из списка доступных книг выбери ТОП-5, которые лучше всего подойдут этому пользователю:\n{avail_text}\n\n"
        f"ТРЕБОВАНИЯ К ОТВЕТУ:\n"
        f"1. Сначала напиши краткий анализ вкусов пользователя (одно предложение).\n"
        f"2. Затем перечисли 5 выбранных книг.\n"
        f"3. В ответе обязательно укажи ID выбранных книг в формате: 'ID: <номер>'."
    )

    try:
        with GigaChat(credentials=GIGACHAT_API_KEY, verify_ssl_certs=False) as giga:
            response = giga.chat(prompt)
            return response.choices[0].message.content
    except Exception as e:
        print(f"Error: {e}")
        return ""


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
