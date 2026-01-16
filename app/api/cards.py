from app.schemas.price import PriceHistoryResponse
from app.services.price_service import get_price_history
from fastapi import APIRouter
from app.schemas.card import CardSearchResponse
from app.services.card_service import search_cards

router = APIRouter(prefix="/cards", tags=["cards"])

@router.get("/search", response_model=CardSearchResponse)
def search_cards_endpoint(q: str):
    results = search_cards(q)
    return {"query": q, "results": results}

@router.get("/{card_name}/price-history", response_model=PriceHistoryResponse)
def price_history(card_name: str, days: int = 14):
    # days is optional query param: /price-history?days=30
    return get_price_history(card_name, days=days)
