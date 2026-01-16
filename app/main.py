from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.cards import router as cards_router
from app.api.watchlist import router as watchlist_router
from app.db.database import init_db

app = FastAPI(title="PokeTrack API")   # ✅ app MUST be defined first

init_db()                              # ✅ safe to call after app exists

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cards_router)       # ✅ include routers AFTER app exists
app.include_router(watchlist_router)

@app.get("/")
def root():
    return {"message": "PokeTrack API is running"}
