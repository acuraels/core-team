from fastapi import APIRouter

from src.pydantic_models import RecommendationResponse
from src.recommendation_service import RecommendationService

router = APIRouter()
recommendation_service = RecommendationService()

@router.get("/")
def read_root():
    return {"message": "API is running. Check /docs for endpoints."}


# # Определяем endpoint на созданном роутере
# @router.get("/recommend/{user_id}", response_model=RecommendationResponse, tags=["Рекомендации"])
# def recommend(user_id: int):
#     """
#     Основной endpoint для получения рекомендаций на основе истории пользователя.
#     """
#     recommendation_data = get_recommendations_logic(user_id)
#     return RecommendationResponse(**recommendation_data)


@router.get("/recommend/{user_id}")
def recommend(user_id: int):
    """
    Основной endpoint для получения рекомендаций на основе истории пользователя.
    """
    return recommendation_service.get_recommendation(user_id)
