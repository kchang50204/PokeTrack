# app/schemas/watchlist.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class WatchlistAddRequest(BaseModel):
    card_name: str

class WatchlistItem(BaseModel):
    card_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
