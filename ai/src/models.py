from pydantic import BaseModel


class Book(BaseModel):
    id: int
    title: str
    author: str
    genre: str
    description: str


class RecommendationResponse(BaseModel):
    user_id: int
    ai_analysis: str
    recommended_books: list[Book]
