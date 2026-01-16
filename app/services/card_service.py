from typing import List
from app.schemas.card import Card

# mock "database" for now
MOCK_CARDS: List[Card] = [
    Card(name="Pikachu", set="Base Set", rarity="Common"),
    Card(name="Charizard", set="Base Set", rarity="Rare"),
    Card(name="Gengar", set="Fossil", rarity="Rare"),
]

def search_cards(query: str) -> List[Card]:
    q = query.strip().lower()
    if not q:
        return []
    return [c for c in MOCK_CARDS if q in c.name.lower()]
