from fastapi import APIRouter

from src.models import RecommendationResponse

router = APIRouter()


def get_recommendations_logic(user_id: int):
    # Имитация работы ИИ и базы данных
    return {
        "user_id": user_id,
        "ai_analysis": f"Анализ для пользователя {user_id} показал, что он любит Sci-Fi.",
        "recommended_books": [
            {"id": 8, "title": "Задача трех тел", "author": "Лю Цысинь", "genre": "Sci-Fi",
             "description": "Контакт с инопланетной цивилизацией."}
        ]
    }


@router.get("/")
def read_root():
    return {"message": "API is running. Check /docs for endpoints."}


# Определяем endpoint на созданном роутере
@router.get("/recommend/{user_id}", response_model=RecommendationResponse, tags=["Рекомендации"])
def recommend(user_id: int):
    """
    Основной endpoint для получения рекомендаций на основе истории пользователя.
    """
    recommendation_data = get_recommendations_logic(user_id)
    return RecommendationResponse(**recommendation_data)
