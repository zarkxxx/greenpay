import { useState } from "react";
import { user } from "../data/mockData";

export default function Profile({ points, bottles, setActiveTab, redeemedCoupons, notifications, onLogout }) {
  const [showReferral, setShowReferral] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const plastic = (bottles * 0.089).toFixed(1);
  const co2 = (bottles * 0.172).toFixed(1);

  return (
    <div className="page">
      <div style={{ padding: "52px 20px 0" }}>
        {/* Profile header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--green), var(--green-dim))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 26, color: "white"
          }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 20, fontWeight: 800 }}>{user.name} Sheth</div>
            <div style={{ fontSize: 13, color: "var(--text2)" }}>{user.email}</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>ID: {user.walletId}</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
          {[
            { label: "Bottles", val: bottles },
            { label: "Points", val: points.toLocaleString() },
            { label: "Level", val: "Bronze" },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: "center", padding: "14px 10px" }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 18, color: "var(--green-light)" }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Impact summary */}
        <div style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)", borderRadius: 14, padding: 16, marginBottom: 24 }}>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🌍 Your Total Impact</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { val: `${plastic} kg`, label: "Plastic Diverted" },
              { val: `${co2} kg`, label: "CO₂ Saved" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 20, color: "var(--green-light)" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="card" style={{ padding: "4px 16px", marginBottom: 16 }}>
          {[
            { icon: "🎫", label: "My Coupons", badge: redeemedCoupons.length || null, action: () => setActiveTab("rewards") },
            { icon: "💰", label: "Wallet & History", action: () => setActiveTab("wallet") },
            { icon: "🏆", label: "Leaderboard & Badges", action: () => setActiveTab("gamification") },
            { icon: "🔥", label: "Challenges", action: () => setActiveTab("campaigns") },
            { icon: "🔔", label: "Notifications", badge: notifications, action: () => {} },
            { icon: "👥", label: "Refer a Friend", action: () => setShowReferral(true) },
            { icon: "⚙️", label: "Settings", action: () => {} },
          ].map((item, i) => (
            <div key={i} className="menu-item" onClick={item.action}>
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.badge > 0 && (
                <span style={{ background: "var(--green)", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 99 }}>
                  {item.badge}
                </span>
              )}
              <span className="menu-arrow">›</span>
            </div>
          ))}
        </div>

        <button className="btn-ghost" style={{ width: "100%", color: "var(--red)", borderColor: "rgba(239,68,68,0.3)", marginBottom: 40 }} onClick={onLogout}>
        Log Out
        </button>
      </div>

      {/* Referral modal */}
      {showReferral && (
        <div className="modal-overlay" onClick={() => setShowReferral(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>👥</div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 22 }}>Refer & Earn</div>
              <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 6 }}>
                Invite friends — both get 100 GreenPoints when they recycle their first bottle
              </div>
            </div>
            <div style={{
              background: "var(--bg2)", border: "1px dashed var(--green)",
              borderRadius: 12, padding: 16, textAlign: "center", marginBottom: 16
            }}>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 4 }}>Your referral code</div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 28, fontWeight: 800, color: "var(--green-light)", letterSpacing: 2 }}>
                {user.referralCode}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={copyCode}>
                {copied ? "Copied! ✅" : "Copy Code"}
              </button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowReferral(false)}>
                Close
              </button>
            </div>
            <div style={{ fontSize: 13, color: "var(--text3)", textAlign: "center", marginTop: 14 }}>
              3 friends joined · 300 pts earned
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
