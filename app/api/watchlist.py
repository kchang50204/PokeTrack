from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.watchlist import WatchlistAddRequest, WatchlistItem
from app.services.watchlist_service import add_to_watchlist, remove_from_watchlist, list_watchlist

router = APIRouter(prefix="/watchlist", tags=["watchlist"])

@router.get("", response_model=List[WatchlistItem])
def get_watchlist(db: Session = Depends(get_db)):
    return list_watchlist(db)

@router.post("", status_code=201)
def add_watchlist(payload: WatchlistAddRequest, db: Session = Depends(get_db)):
    add_to_watchlist(db, payload.card_name)
    return {"ok": True}

@router.delete("/{card_name}")
def delete_watchlist(card_name: str, db: Session = Depends(get_db)):
    remove_from_watchlist(db, card_name)
    return {"ok": True}
