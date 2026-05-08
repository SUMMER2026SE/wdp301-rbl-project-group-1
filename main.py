from fastapi import FastAPI

from src.api.recommend import router as recommend_router

app = FastAPI(title="Recommendation System")
app.include_router(recommend_router)


@app.get("/")
def health_check():
	return {"status": "ok", "message": "Recommendation system started"}