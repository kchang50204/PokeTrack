from pydantic import BaseModel
from typing import List
from datetime import date

class PricePoint(BaseModel):
    date: date
    price: float

class PriceHistoryResponse(BaseModel):
    card_name: str
    currency: str = "USD"
    points: List[PricePoint]
    latest_price: float
    percent_change_7d: float
