import { user } from "../data/mockData";

export default function Home({ points, bottles, setActiveTab }) {
  const equiv = Math.floor(points / 10);
  const plastic = (bottles * 0.089).toFixed(1);
  const co2 = (bottles * 0.172).toFixed(1);

  return (
    <div className="page">
      {/* Header */}
      <div style={{ padding: "52px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 2 }}>📍 {user.city}</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800 }}>
            Hello, {user.name} 🌱
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>You're making a difference</div>
        </div>
        <button
          style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}
          onClick={() => setActiveTab("profile")}
        >
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--green), var(--green-dim))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: "white"
          }}>M</div>
        </button>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Wallet Card */}
        <div className="wallet-card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
            GreenPoints Balance
          </div>
          <div className="wallet-pts">
            {points.toLocaleString()}
            <span>GP</span>
          </div>
          <div className="wallet-equiv">≈ <strong>₹{equiv}</strong> redeemable value</div>

          <div style={{ display: "flex", gap: 10, marginTop: 20, position: "relative", zIndex: 1 }}>
            <button className="btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setActiveTab("rewards")}>
              Redeem
            </button>
            <button className="btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setActiveTab("wallet")}>
              History
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <div className="section-title">Quick Actions</div>
          </div>
          <div className="action-grid">
            <button className="action-btn" onClick={() => setActiveTab("scan")}>
              <div className="action-icon" style={{ background: "rgba(22,163,74,0.15)" }}>📷</div>
              <div className="action-label">Scan Machine</div>
            </button>
            <button className="action-btn" onClick={() => setActiveTab("map")}>
              <div className="action-icon" style={{ background: "rgba(59,130,246,0.15)" }}>🗺️</div>
              <div className="action-label">Find Nearby</div>
            </button>
            <button className="action-btn" onClick={() => setActiveTab("rewards")}>
              <div className="action-icon" style={{ background: "rgba(245,158,11,0.15)" }}>🎁</div>
              <div className="action-label">My Rewards</div>
            </button>
            <button className="action-btn" onClick={() => setActiveTab("gamification")}>
              <div className="action-icon" style={{ background: "rgba(168,85,247,0.15)" }}>🏆</div>
              <div className="action-label">Leaderboard</div>
            </button>
          </div>
        </div>

        {/* Impact Stats */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <div className="section-title">Your Impact</div>
            <button className="section-link" onClick={() => setActiveTab("gamification")}>See all →</button>
          </div>
          <div className="impact-strip">
            <div className="impact-card">
              <div className="impact-num">{bottles}</div>
              <div className="impact-label">Bottles</div>
            </div>
            <div className="impact-card">
              <div className="impact-num">{plastic}kg</div>
              <div className="impact-label">Plastic Saved</div>
            </div>
            <div className="impact-card">
              <div className="impact-num">{co2}kg</div>
              <div className="impact-label">CO₂ Reduced</div>
            </div>
            <div className="impact-card">
              <div className="impact-num" style={{ fontSize: 16 }}>🌳 {(bottles * 0.009).toFixed(1)}</div>
              <div className="impact-label">Trees Equiv.</div>
            </div>
          </div>
        </div>

        {/* Active Campaign Teaser */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <div className="section-title">Active Challenge</div>
            <button className="section-link" onClick={() => setActiveTab("campaigns")}>All →</button>
          </div>
          <button
            className="campaign-card active"
            style={{ width: "100%", background: "none", cursor: "pointer", textAlign: "left", border: "1px solid rgba(22,163,74,0.3)", borderRadius: 16, padding: 20 }}
            onClick={() => setActiveTab("campaigns")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15 }}>Daily Dash 🔥</div>
                <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>Recycle 10 bottles today</div>
              </div>
              <span className="tag tag-green">+50 pts</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "40%" }} />
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>4 / 10 bottles · Ends tonight</div>
          </button>
        </div>
      </div>
    </div>
  );
}
