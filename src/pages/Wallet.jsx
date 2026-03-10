import { useState, useEffect } from "react";
import { getTransactions } from "../lib/db";

const DEMO_TRANSACTIONS = [
  { id: "d1", type: "earn", description: "Bottle recycled at GP-AHM-001", points: 5, createdAt: null, _label: "Today, 3:45 PM" },
  { id: "d2", type: "earn", description: "Bottle recycled at GP-AHM-003", points: 5, createdAt: null, _label: "Today, 11:20 AM" },
  { id: "d3", type: "bonus", description: "Referral Bonus", points: 100, createdAt: null, _label: "Yesterday" },
  { id: "d4", type: "redeem", description: "Redeemed: ₹50 Off on Orders", points: -500, createdAt: null, _label: "10 Mar 2026" },
  { id: "d5", type: "bonus", description: "Welcome Bonus", points: 100, createdAt: null, _label: "10 Mar 2026" },
  { id: "d6", type: "earn", description: "Bottle recycled at GP-AHM-002", points: 5, createdAt: null, _label: "9 Mar 2026" },
  { id: "d7", type: "earn", description: "Bottle recycled at GP-AHM-004", points: 5, createdAt: null, _label: "9 Mar 2026" },
  { id: "d8", type: "redeem", description: "Redeemed: Free Premium Paan", points: -300, createdAt: null, _label: "9 Mar 2026" },
  { id: "d9", type: "earn", description: "Bottle recycled at GP-AHM-001", points: 5, createdAt: null, _label: "8 Mar 2026" },
  { id: "d10", type: "redeem", description: "Redeemed: ₹10 Cashback", points: -100, createdAt: null, _label: "8 Mar 2026" },
];

export default function Wallet({ points, setActiveTab, userId, isDemoMode }) {
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      setTransactions(DEMO_TRANSACTIONS);
      setLoading(false);
    } else if (userId) {
      getTransactions(userId)
        .then(setTransactions)
        .catch(() => setTransactions([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId, isDemoMode]);

  const equiv = Math.floor(points / 10);

  const filtered = transactions.filter(t => {
    if (filter === "earned") return t.points > 0;
    if (filter === "redeemed") return t.points < 0;
    return true;
  });

  const icons = { earn: "♻️", bonus: "🎁", redeem: "🛍️" };
  const bgColors = { earn: "rgba(22,163,74,0.15)", bonus: "rgba(245,158,11,0.15)", redeem: "rgba(239,68,68,0.15)" };

  const formatDate = (tx) => {
    if (tx._label) return tx._label;
    if (tx.createdAt?.toDate) {
      return tx.createdAt.toDate().toLocaleDateString("en-IN", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
      });
    }
    return "Just now";
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => setActiveTab("home")}>‹</button>
        <div className="page-title">Wallet</div>
      </div>

      <div style={{ padding: "0 20px" }}>
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

        {/* Summary strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <div className="card" style={{ textAlign: "center", padding: "12px 10px" }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--green-light)" }}>
              +{transactions.filter(t => t.points > 0).reduce((s, t) => s + t.points, 0)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Total Earned</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "12px 10px" }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 18, color: "#EF4444" }}>
              {transactions.filter(t => t.points < 0).reduce((s, t) => s + t.points, 0)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Total Redeemed</div>
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
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{formatDate(tx)}</div>
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