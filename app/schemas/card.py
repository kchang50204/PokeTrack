from pydantic import BaseModel
from typing import List

class Card(BaseModel):
    name: str
    set: str
    rarity: str

class CardSearchResponse(BaseModel):
    query: str
    results: List[Card]
