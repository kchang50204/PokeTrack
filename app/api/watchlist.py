from fastapi import APIRouter
from typing import List
from app.schemas.watchlist import WatchlistAddRequest, WatchlistItem
from app.services.watchlist_service import add_to_watchlist, remove_from_watchlist, list_watchlist

router = APIRouter(prefix="/watchlist", tags=["watchlist"])

@router.get("", response_model=List[WatchlistItem])
def get_watchlist():
    return list_watchlist()

@router.post("", status_code=201)
def add_watchlist(payload: WatchlistAddRequest):
    add_to_watchlist(payload.card_name)
    return {"ok": True}

@router.delete("/{card_name}")
def delete_watchlist(card_name: str):
    remove_from_watchlist(card_name)
    return {"ok": True}
