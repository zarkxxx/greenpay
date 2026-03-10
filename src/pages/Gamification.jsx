import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { getLeaderboard } from "../lib/db";

const levels = [
  { name: "Bronze", min: 0, max: 100, color: "#CD7F32" },
  { name: "Silver", min: 100, max: 500, color: "#C0C0C0" },
  { name: "Gold", min: 500, max: 1000, color: "#FFD700" },
  { name: "Green Champion", min: 1000, max: 5000, color: "#16A34A" },
];

export default function Gamification({ bottles, points, setActiveTab }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("leaderboard");
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbLoading, setLbLoading] = useState(true);

  const currentLevel = levels.find(l => bottles >= l.min && bottles < l.max) || levels[0];
  const nextLevel = levels[levels.indexOf(currentLevel) + 1];
  const progress = nextLevel ? ((bottles - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  useEffect(() => {
    if (tab === "leaderboard") {
      getLeaderboard()
        .then(data => setLeaderboard(data))
        .catch(() => setLeaderboard([]))
        .finally(() => setLbLoading(false));
    }
  }, [tab]);

  const badges = [
    { id: 1, icon: "♻️", name: "First Recycle", desc: "Recycled your first bottle", unlocked: bottles >= 1 },
    { id: 2, icon: "🔟", name: "10 Bottles", desc: "Recycled 10 bottles", unlocked: bottles >= 10 },
    { id: 3, icon: "💯", name: "Century", desc: "Recycled 100 bottles", unlocked: bottles >= 100 },
    { id: 4, icon: "⭐", name: "Point Collector", desc: "Earned 500 GreenPoints", unlocked: points >= 500 },
    { id: 5, icon: "💎", name: "GP Elite", desc: "Earned 1000 GreenPoints", unlocked: points >= 1000 },
    { id: 6, icon: "🌍", name: "Eco Warrior", desc: "Recycled 50 bottles", unlocked: bottles >= 50 },
    { id: 7, icon: "🏆", name: "Green Champion", desc: "Reached Green Champion level", unlocked: bottles >= 1000 },
    { id: 8, icon: "🔥", name: "On Fire", desc: "Recycled 30 bottles in a week", unlocked: false },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => setActiveTab("home")}>‹</button>
        <div className="page-title">Rankings & Badges</div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div className="wallet-card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Current Level</div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 24, fontWeight: 800, color: currentLevel.color }}>
                {currentLevel.name}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 32, fontWeight: 800, color: "white" }}>{bottles}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>bottles</div>
            </div>
          </div>
          {nextLevel && (
            <>
              <div className="progress-bar" style={{ marginBottom: 6 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {nextLevel.min - bottles} bottles to {nextLevel.name}
              </div>
            </>
          )}
        </div>

        <div className="filter-tabs" style={{ marginBottom: 16 }}>
          {["leaderboard", "badges", "levels"].map(t => (
            <button key={t} className={`filter-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "leaderboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>Top recyclers</div>
            {lbLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>Loading...</div>
            ) : leaderboard.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No data yet. Start recycling!</div>
            ) : leaderboard.map((entry, i) => {
              const rank = i + 1;
              const isUser = entry.id === user?.uid;
              return (
                <div key={entry.id} className={`lb-row ${isUser ? "is-user" : ""}`}>
                  <div className="lb-rank" style={{ color: rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : "var(--text3)" }}>
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: isUser ? "var(--green)" : "var(--card2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 13 }}>
                    {(entry.name || "U").charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {entry.name || entry.email?.split("@")[0] || "User"}
                      {isUser && <span className="tag tag-green" style={{ fontSize: 10, marginLeft: 6 }}>You</span>}
                    </div>
                  </div>
                  <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16, color: isUser ? "var(--green-light)" : "var(--text)" }}>
                    {entry.bottles || 0} 🍾
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "badges" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {badges.map(b => (
              <div key={b.id} className={`badge-card ${b.unlocked ? "unlocked" : "locked"}`}>
                <div className="badge-emoji">{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{b.name}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.4 }}>{b.desc}</div>
                {b.unlocked && <span className="tag tag-green" style={{ fontSize: 10 }}>Earned</span>}
              </div>
            ))}
          </div>
        )}

        {tab === "levels" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {levels.map(l => (
              <div key={l.name} className="card" style={{ border: l.name === currentLevel.name ? `1px solid ${l.color}` : "1px solid var(--border)", background: l.name === currentLevel.name ? `${l.color}10` : "var(--card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16, color: l.color }}>{l.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>{l.min}–{l.max} bottles</div>
                  </div>
                  {l.name === currentLevel.name && <span className="tag tag-green">Current</span>}
                  {bottles >= l.max && <span>✅</span>}
                  {bottles < l.min && <span style={{ color: "var(--text3)", fontSize: 20 }}>🔒</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}