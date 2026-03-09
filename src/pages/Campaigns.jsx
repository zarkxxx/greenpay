import { campaigns } from "../data/mockData";

export default function Campaigns({ setActiveTab }) {
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
          {campaigns.map(c => (
            <div key={c.id} className="campaign-card active">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 17 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>{c.desc}</div>
                </div>
                <span className="tag tag-gold">{c.reward}</span>
              </div>
              <div className="progress-bar" style={{ marginBottom: 6 }}>
                <div className="progress-fill" style={{ width: `${(c.progress / c.target) * 100}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text3)" }}>
                <span>{c.progress} / {c.target} bottles</span>
                <span>⏱ {c.deadline}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="section-title" style={{ marginBottom: 12 }}>✅ Completed</div>
        <div className="card" style={{ opacity: 0.6 }}>
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
