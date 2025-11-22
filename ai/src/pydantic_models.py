from pydantic import BaseModel


class Book(BaseModel):
    isbn: int
    title: str
    author: str
    description: str
    image_url: str

def map_books_to_ts(books: list[Book]) -> list[dict]:
    return [
        {
            "id": book.isbn,           # isbn → id
            "name": book.title,        # title → name
            "author": book.author,
            "year": None,              # нет в API, оставляем None
            "coverUrl": book.image_url # image_url → coverUrl
        }
        for book in books
    ]

class RecommendationResponse(BaseModel):
    user_id: str
    recommended_books: list[Book]

