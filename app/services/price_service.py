from datetime import date, timedelta
from typing import List
from app.schemas.price import PricePoint, PriceHistoryResponse

def _round2(x: float) -> float:
    return float(f"{x:.2f}")

def get_price_history(card_name: str, days: int = 14) -> PriceHistoryResponse:
    """
    Mock price history generator.
    Later you can replace this with real API calls + DB persistence.
    """
    name = card_name.strip()
    if not name:
        # Keep it simple: empty name => empty history
        return PriceHistoryResponse(
            card_name=card_name,
            points=[],
            latest_price=0.0,
            percent_change_7d=0.0,
        )

    today = date.today()

    # Deterministic-ish base price based on name (so results feel stable)
    base = 10 + (sum(ord(c) for c in name.lower()) % 40)  # $10..$49
    points: List[PricePoint] = []

    # Simple “trend” pattern
    for i in range(days):
        d = today - timedelta(days=(days - 1 - i))
        # gentle wave + slight upward drift
        wave = ((i % 7) - 3) * 0.35
        drift = i * 0.08
        price = base + wave + drift
        points.append(PricePoint(date=d, price=_round2(price)))

    latest = points[-1].price if points else 0.0

    # percent change vs 7 days ago
    if len(points) >= 8 and points[-8].price != 0:
        old = points[-8].price
        pct = ((latest - old) / old) * 100
    else:
        pct = 0.0

    return PriceHistoryResponse(
        card_name=card_name,
        points=points,
        latest_price=_round2(latest),
        percent_change_7d=_round2(pct),
    )
