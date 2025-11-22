from pydantic import BaseModel


class Book(BaseModel):
    isbn: int
    title: str
    author: str
    description: str
    image_url: str


class RecommendationResponse(BaseModel):
    user_id: int
    recommended_books: list[Book]
