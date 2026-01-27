from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.watchlist import WatchlistItem

def add_to_watchlist(db: Session, card_name: str) -> None:
    name = card_name.strip().lower()
    if not name:
        return

    existing = db.query(WatchlistItem).filter(WatchlistItem.card_name == name).first()
    if existing:
        return

    db.add(WatchlistItem(card_name=name))
    db.commit()

def remove_from_watchlist(db: Session, card_name: str) -> None:
    name = card_name.strip().lower()
    if not name:
        return

    db.query(WatchlistItem).filter(WatchlistItem.card_name == name).delete()
    db.commit()

def list_watchlist(db: Session):
    return db.query(WatchlistItem).order_by(desc(WatchlistItem.created_at)).all()
