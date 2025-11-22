import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI

from src.api import router as main_router

load_dotenv()
app = FastAPI(title="Book Recommender AI")

app.include_router(
    main_router,
    prefix="/api/v1/recommend",
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
