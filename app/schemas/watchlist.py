from pydantic import BaseModel

class WatchlistAddRequest(BaseModel):
    card_name: str

class WatchlistItem(BaseModel):
    card_name: str
    created_at: str
