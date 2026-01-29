import { useEffect, useMemo, useState } from "react";
import {
  searchCards,
  getPriceHistory,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "./lib/api";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [days, setDays] = useState(14);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Watchlist state
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistError, setWatchlistError] = useState("");

  // Load watchlist on mount
  useEffect(() => {
    (async () => {
      try {
        setWatchlistLoading(true);
        const data = await getWatchlist();
        setWatchlist(data || []);
        setWatchlistError("");
      } catch (err) {
        setWatchlistError(err.message || "Failed to load watchlist");
      } finally {
        setWatchlistLoading(false);
      }
    })();
  }, []);

  // For quick "is saved?" checks
  const watchlistSet = useMemo(
    () => new Set(watchlist.map((w) => w.card_name?.toLowerCase())),
    [watchlist]
  );

  function isSaved(cardName) {
    return watchlistSet.has(cardName.toLowerCase());
  }

  async function refreshWatchlist() {
    const data = await getWatchlist();
    setWatchlist(data || []);
  }

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setSelected(null);
    setPriceData(null);

    if (!query.trim()) return;

    try {
      setLoading(true);
      const data = await searchCards(query.trim());
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(card) {
    setSelected(card);
    setError("");
    setPriceData(null);

    try {
      setLoading(true);
      const data = await getPriceHistory(card.name, days);
      setPriceData(data);
    } catch (err) {
      setError(err.message || "Failed to load price history");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
  if (!selected) return;
  (async () => {
    try {
      setLoading(true);
      const data = await getPriceHistory(selected.name, days);
      setPriceData(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load price history");
    } finally {
      setLoading(false);
    }
  })();
}, [days]); // runs when days changes


  async function handleAddToWatchlist(cardName) {
    try {
      setError("");
      await addToWatchlist(cardName);
      await refreshWatchlist();
    } catch (err) {
      setError(err.message || "Failed to add to watchlist");
    }
  }

  async function handleRemoveFromWatchlist(cardName) {
  const key = cardName.toLowerCase();
  try {
    setError("");
    await removeFromWatchlist(cardName); // backend lowercases anyway
    setWatchlist((prev) => prev.filter((x) => x.card_name?.toLowerCase() !== key));
  } catch (err) {
    setError(err.message || "Failed to remove from watchlist");
  }
}


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            PokeTrack <span className="text-blue-400">Price Tracker</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Search cards and view mock price history (FastAPI + React + Tailwind).
          </p>
        </header>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Search a card... (e.g., pikachu)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="rounded-xl bg-blue-500 px-5 py-3 font-semibold text-black hover:bg-blue-400 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "..." : "Search"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm text-gray-400">Price history days:</label>
          <select
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>7</option>
            <option value={14}>14</option>
            <option value={30}>30</option>
          </select>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Results */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <h2 className="mb-3 text-lg font-semibold">Results</h2>

            {results.length === 0 ? (
              <p className="text-sm text-gray-400">
                Search for a card to see results.
              </p>
            ) : (
              <ul className="space-y-2">
                {results.map((card, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleSelect(card)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition
                        ${
                          selected?.name === card.name
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-800 bg-gray-950/30 hover:border-gray-700"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{card.name}</span>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {card.rarity}
                          </span>

                          <button
                            type="button"
                            className="rounded-lg border border-gray-700 bg-gray-950/40 px-2 py-1 text-xs text-gray-200 hover:border-gray-500 disabled:opacity-50"
                            disabled={isSaved(card.name)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWatchlist(card.name);
                            }}
                          >
                            {isSaved(card.name) ? "Saved" : "Add"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-1 text-xs text-gray-500">{card.set}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Price history */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <h2 className="mb-3 text-lg font-semibold">Price history</h2>

            {!selected ? (
              <p className="text-sm text-gray-400">Select a card to view prices.</p>
            ) : loading && !priceData ? (
              <p className="text-sm text-gray-400">Loading price history…</p>
            ) : priceData ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-800 bg-gray-950/30 p-4">
                  <div className="text-sm text-gray-400">Selected</div>
                  <div className="text-lg font-semibold">{selected.name}</div>
                  <div className="mt-2 flex gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Latest</div>
                      <div className="font-semibold">${priceData.latest_price}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">7d change</div>
                      <div
                        className={`font-semibold ${
                          priceData.percent_change_7d >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {priceData.percent_change_7d}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-h-72 overflow-auto rounded-xl border border-gray-800">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-950">
                      <tr className="text-left text-gray-400">
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceData.points.map((p, i) => (
                        <tr key={i} className="border-t border-gray-800">
                          <td className="px-4 py-2 text-gray-300">{p.date}</td>
                          <td className="px-4 py-2 font-medium">${p.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No data yet.</p>
            )}
          </section>
        </div>

        {/* Watchlist Panel */}
        <section className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="mb-3 text-lg font-semibold">Watchlist</h2>

          {watchlistLoading && (
            <p className="text-sm text-gray-400">Loading watchlist…</p>
          )}

          {watchlistError && (
            <p className="text-sm text-red-300">{watchlistError}</p>
          )}

          {!watchlistLoading && !watchlistError && watchlist.length === 0 && (
            <p className="text-sm text-gray-400">No cards saved yet.</p>
          )}

          {watchlist.length > 0 && (
  <ul className="space-y-2">
    {watchlist.map((item) => (
      <li
        key={item.card_name}
        className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950/30 px-4 py-3"
      >
        <div>
          <div className="font-medium">{item.card_name}</div>
          <div className="text-xs text-gray-500">
            Added: {new Date(item.created_at).toLocaleString()}
          </div>
        </div>

        <button
          className="rounded-lg border border-gray-700 px-3 py-2 text-xs hover:border-gray-500"
          onClick={() => handleRemoveFromWatchlist(item.card_name)}
        >
          Remove
        </button>
      </li>
    ))}
  </ul>
)}

        </section>

        <footer className="mt-10 text-xs text-gray-500">
          Tip: if the UI can’t reach the API, check FastAPI is running and CORS allows
          <span className="text-gray-300"> http://localhost:5174</span>.
        </footer>
      </div>
    </div>
  );
}
