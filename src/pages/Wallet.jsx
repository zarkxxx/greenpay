import { useState, useEffect } from "react";
import { getTransactions } from "../lib/db";

export default function Wallet({ points, setActiveTab, userId }) {
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getTransactions(userId)
        .then(setTransactions)
        .catch(() => setTransactions([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // demo mode or not logged in
    }
  }, [userId]);

  const equiv = Math.floor(points / 10);

  const filtered = transactions.filter(t => {
    if (filter === "earned") return t.points > 0;
    if (filter === "redeemed") return t.points < 0;
    return true;
  });

  const icons = { earn: "♻️", bonus: "🎁", redeem: "🛍️" };
  const bgColors = { earn: "rgba(22,163,74,0.15)", bonus: "rgba(245,158,11,0.15)", redeem: "rgba(239,68,68,0.15)" };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => setActiveTab("home")}>‹</button>
        <div className="page-title">Wallet</div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div className="wallet-card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Available Balance</div>
          <div className="wallet-pts">{points.toLocaleString()}<span>GP</span></div>
          <div className="wallet-equiv">≈ <strong>₹{equiv}</strong> redeemable value</div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, position: "relative", zIndex: 1 }}>
            <button className="btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setActiveTab("rewards")}>Redeem Points</button>
          </div>
        </div>

        <div className="filter-tabs" style={{ marginBottom: 16 }}>
          {["all", "earned", "redeemed"].map(f => (
            <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="section-title" style={{ marginBottom: 12 }}>Transaction History</div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
            No transactions yet. Start recycling!
          </div>
        ) : (
          <div className="card" style={{ padding: "4px 16px" }}>
            {filtered.map(tx => (
              <div key={tx.id} className="tx-row">
                <div className="tx-icon" style={{ background: bgColors[tx.type] || bgColors.earn }}>
                  {icons[tx.type] || "♻️"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{tx.description || "Transaction"}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                    {tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "Just now"}
                  </div>
                </div>
                <div className={`tx-pts ${tx.points > 0 ? "positive" : "negative"}`}>
                  {tx.points > 0 ? "+" : ""}{tx.points} GP
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
