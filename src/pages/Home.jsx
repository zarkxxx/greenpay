export default function Home({ points, bottles, setActiveTab, user }) {
  const equiv = Math.floor(points / 10);
  const plastic = (bottles * 0.089).toFixed(1);
  const co2 = (bottles * 0.172).toFixed(1);
  const name = user?.name?.split(" ")[0] || "there";
  const initials = (user?.name || "U").charAt(0).toUpperCase();

  const dailyProgress = Math.min(bottles, 10);
  const dailyPct = Math.min((dailyProgress / 10) * 100, 100);
  const dailyDone = dailyProgress >= 10;

  return (
    <div className="page">
      <div style={{ padding: "52px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 2 }}>📍 Ahmedabad</div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 24, fontWeight: 800 }}>
            Hello, {name} 🌱
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>You're making a difference</div>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => setActiveTab("profile")}>
          {user?.avatar ? (
            <img src={user.avatar} alt={name} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, var(--green), var(--green-dim))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>
              {initials}
            </div>
          )}
        </button>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Wallet card */}
        <div className="wallet-card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
            GreenPoints Balance
          </div>
          <div className="wallet-pts">{points.toLocaleString()}<span>GP</span></div>
          <div className="wallet-equiv">≈ <strong>₹{equiv}</strong> redeemable value</div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, position: "relative", zIndex: 1 }}>
            <button className="btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setActiveTab("rewards")}>Redeem</button>
            <button className="btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setActiveTab("wallet")}>History</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <div className="section-title">Quick Actions</div>
          </div>
          <div className="action-grid">
            <button className="action-btn" onClick={() => setActiveTab("scan")} aria-label="Scan a machine to earn points">
              <div className="action-icon" style={{ background: "rgba(22,163,74,0.15)" }}>📷</div>
              <div className="action-label">Scan Machine</div>
            </button>
            <button className="action-btn" onClick={() => setActiveTab("map")} aria-label="Find nearby recycling machines">
              <div className="action-icon" style={{ background: "rgba(59,130,246,0.15)" }}>🗺️</div>
              <div className="action-label">Find Nearby</div>
            </button>
            <button className="action-btn" onClick={() => setActiveTab("coupons")} aria-label="View your redeemed coupons">
              <div className="action-icon" style={{ background: "rgba(245,158,11,0.15)" }}>🎁</div>
              <div className="action-label">My Rewards</div>
            </button>
            <button className="action-btn" onClick={() => setActiveTab("gamification")} aria-label="View leaderboard and badges">
              <div className="action-icon" style={{ background: "rgba(168,85,247,0.15)" }}>🏆</div>
              <div className="action-label">Leaderboard</div>
            </button>
          </div>
        </div>

        {/* Impact */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <div className="section-title">Your Impact</div>
            <button className="section-link" onClick={() => setActiveTab("gamification")}>See all →</button>
          </div>
          <div className="impact-strip">
            <div className="impact-card"><div className="impact-num">{bottles}</div><div className="impact-label">Bottles</div></div>
            <div className="impact-card"><div className="impact-num">{plastic}kg</div><div className="impact-label">Plastic Saved</div></div>
            <div className="impact-card"><div className="impact-num">{co2}kg</div><div className="impact-label">CO₂ Reduced</div></div>
            <div className="impact-card"><div className="impact-num" style={{ fontSize: 16 }}>🌳 {(bottles * 0.009).toFixed(1)}</div><div className="impact-label">Trees Equiv.</div></div>
          </div>
        </div>

        {/* Active Challenge */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <div className="section-title">Active Challenge</div>
            <button className="section-link" onClick={() => setActiveTab("campaigns")}>All →</button>
          </div>
          <button
            style={{ width: "100%", background: dailyDone ? "rgba(22,163,74,0.08)" : "none", cursor: "pointer", textAlign: "left", border: `1px solid ${dailyDone ? "var(--green)" : "rgba(22,163,74,0.3)"}`, borderRadius: 16, padding: 20 }}
            onClick={() => setActiveTab("campaigns")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 15 }}>
                  Daily Dash 🔥 {dailyDone && <span style={{ color: "var(--green-light)", fontSize: 13 }}>✓ Complete!</span>}
                </div>
                <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>Recycle 10 bottles today</div>
              </div>
              <span className="tag tag-green">+50 pts</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${dailyPct}%` }} />
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>
              {dailyProgress} / 10 bottles · Ends tonight
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}