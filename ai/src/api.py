from fastapi import APIRouter

from src.recommendation_service import RecommendationService


router = APIRouter()
recommendation_service = RecommendationService()


@router.get("/")
def read_root():
    return {"message": "API is running. Check /docs for endpoints."}


@router.get("/recommend/{user_id}")
def recommend(user_id: int):
    """
    Основной endpoint для получения рекомендаций на основе истории пользователя.
    """
    return recommendation_service.get_recommendation(user_id)
