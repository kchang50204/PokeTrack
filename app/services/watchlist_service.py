from app.db.database import get_conn

def add_to_watchlist(card_name: str):
    with get_conn() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO watchlist(card_name) VALUES (?)",
            (card_name.lower(),)
        )
        conn.commit()

def remove_from_watchlist(card_name: str):
    with get_conn() as conn:
        conn.execute("DELETE FROM watchlist WHERE card_name = ?", (card_name.lower(),))
        conn.commit()

def list_watchlist():
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT card_name, created_at FROM watchlist ORDER BY created_at DESC"
        ).fetchall()
        return [dict(r) for r in rows]
