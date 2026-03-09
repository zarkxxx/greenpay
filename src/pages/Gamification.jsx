import { useState } from "react";
import { leaderboard, badges } from "../data/mockData";

const levels = [
  { name: "Bronze", min: 0, max: 100, color: "#CD7F32" },
  { name: "Silver", min: 100, max: 500, color: "#C0C0C0" },
  { name: "Gold", min: 500, max: 1000, color: "#FFD700" },
  { name: "Green Champion", min: 1000, max: 5000, color: "#16A34A" },
];

export default function Gamification({ bottles, setActiveTab }) {
  const [tab, setTab] = useState("leaderboard");

  const currentLevel = levels.find(l => bottles >= l.min && bottles < l.max) || levels[0];
  const nextLevel = levels[levels.indexOf(currentLevel) + 1];
  const progress = nextLevel ? ((bottles - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => setActiveTab("home")}>‹</button>
        <div className="page-title">Rankings & Badges</div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Level card */}
        <div className="wallet-card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Current Level</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: currentLevel.color }}>
                {currentLevel.name}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: "white" }}>{bottles}</div>
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

        {/* Tab switcher */}
        <div className="filter-tabs" style={{ marginBottom: 16 }}>
          {["leaderboard", "badges", "levels"].map(t => (
            <button key={t} className={`filter-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "leaderboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>Weekly rankings</div>
            {leaderboard.map(entry => (
              <div key={entry.rank} className={`lb-row ${entry.isUser ? "is-user" : ""}`}>
                <div className="lb-rank" style={{
                  color: entry.rank === 1 ? "#FFD700" : entry.rank === 2 ? "#C0C0C0" : entry.rank === 3 ? "#CD7F32" : "var(--text3)"
                }}>
                  {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: entry.isUser ? "var(--green)" : "var(--card2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13
                }}>
                  {entry.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {entry.name} {entry.isUser && <span className="tag tag-green" style={{ fontSize: 10 }}>You</span>}
                  </div>
                </div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: entry.isUser ? "var(--green-light)" : "var(--text)" }}>
                  {entry.bottles} 🍾
                </div>
              </div>
            ))}
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
              <div key={l.name} className="card" style={{
                border: l.name === currentLevel.name ? `1px solid ${l.color}` : "1px solid var(--border)",
                background: l.name === currentLevel.name ? `${l.color}10` : "var(--card)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: l.color }}>{l.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>{l.min}–{l.max} bottles</div>
                  </div>
                  {l.name === currentLevel.name && <span className="tag tag-green">Current</span>}
                  {bottles >= l.min && l.name !== currentLevel.name && <span>✅</span>}
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
