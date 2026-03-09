import { useState } from "react";
import { transactions } from "../data/mockData";

export default function Wallet({ points, setActiveTab }) {
  const [filter, setFilter] = useState("all");

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
        {/* Balance card */}
        <div className="wallet-card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
            Available Balance
          </div>
          <div className="wallet-pts">{points.toLocaleString()}<span>GP</span></div>
          <div className="wallet-equiv">≈ <strong>₹{equiv}</strong> redeemable value</div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, position: "relative", zIndex: 1 }}>
            <button className="btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setActiveTab("rewards")}>
              Redeem Points
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-tabs" style={{ marginBottom: 16 }}>
          {["all", "earned", "redeemed"].map(f => (
            <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div className="section-title" style={{ marginBottom: 12 }}>Transaction History</div>
        <div className="card" style={{ padding: "4px 16px" }}>
          {filtered.map(tx => (
            <div key={tx.id} className="tx-row">
              <div className="tx-icon" style={{ background: bgColors[tx.type] }}>
                {icons[tx.type]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{tx.label}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{tx.date}</div>
              </div>
              <div className={`tx-pts ${tx.points > 0 ? "positive" : "negative"}`}>
                {tx.points > 0 ? "+" : ""}{tx.points} GP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
