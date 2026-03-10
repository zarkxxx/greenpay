import { useAuth } from "../lib/AuthContext";

const CAMPAIGNS = [
  { id: "daily", title: "Daily Dash 🔥", desc: "Recycle 10 bottles today", target: 10, reward: "+50 GreenPoints", deadline: "Ends tonight" },
  { id: "weekend", title: "Weekend Warrior", desc: "Recycle 30 bottles this weekend", target: 30, reward: "₹100 Voucher", deadline: "2 days left" },
  { id: "march", title: "March Madness", desc: "Top recycler of March wins ₹500", target: 200, reward: "₹500 Cash Prize", deadline: "21 days left" },
];

export default function Campaigns({ setActiveTab, bottles }) {
  const isWelcomeDone = bottles > 0;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => setActiveTab("home")}>‹</button>
        <div className="page-title">Challenges</div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
          Complete challenges to earn bonus GreenPoints and exclusive rewards.
        </div>

        <div className="section-title" style={{ marginBottom: 12 }}>🔥 Active Challenges</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {CAMPAIGNS.map(c => {
            const progress = Math.min(bottles, c.target);
            const pct = (progress / c.target) * 100;
            const done = progress >= c.target;
            return (
              <div key={c.id} className="campaign-card active" style={{ opacity: done ? 0.6 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17 }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>{c.desc}</div>
                  </div>
                  <span className={`tag ${done ? "tag-green" : "tag-gold"}`}>{done ? "✅ Done" : c.reward}</span>
                </div>
                <div className="progress-bar" style={{ marginBottom: 6 }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text3)" }}>
                  <span>{progress} / {c.target} bottles</span>
                  <span>⏱ {c.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="section-title" style={{ marginBottom: 12 }}>✅ Completed</div>
        <div className="card" style={{ opacity: isWelcomeDone ? 1 : 0.4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Welcome Bonus</div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>Recycle your first bottle</div>
            </div>
            <span className="tag tag-green">+100 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}