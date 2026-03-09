import { useState } from "react";
import { machines } from "../data/mockData";

export default function MapPage({ setActiveTab }) {
  const [selected, setSelected] = useState(null);

  const statusColor = { available: "var(--green-light)", full: "var(--red)", offline: "var(--text3)" };
  const statusBg = { available: "tag-green", full: "tag-red", offline: "tag-gray" };

  return (
    <div className="page">
      <div className="page-header" style={{ paddingTop: 52 }}>
        <div className="page-title">Nearby Machines</div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Map embed */}
        <div className="map-container" style={{ marginBottom: 16, height: 260 }}>
          <iframe
            title="GreenPay Machines Map"
            width="100%"
            height="260"
            style={{ border: "none", filter: "invert(0.9) hue-rotate(180deg)" }}
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29387.44734305167!2d72.5714!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
          />
        </div>

        {/* Machine list */}
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>
          {machines.filter(m => m.status === "available").length} machines available near you
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {machines.map(m => (
            <button
              key={m.id}
              className="card"
              style={{ width: "100%", textAlign: "left", cursor: "pointer", border: selected?.id === m.id ? "1px solid var(--green)" : "1px solid var(--border)", background: "var(--card)" }}
              onClick={() => setSelected(selected?.id === m.id ? null : m)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: selected?.id === m.id ? 12 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: m.status === "available" ? "rgba(22,163,74,0.15)" : "rgba(239,68,68,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
                  }}>
                    🗑️
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 1 }}>{m.id} · {m.distance}</div>
                  </div>
                </div>
                <span className={`tag ${statusBg[m.status]}`}>{m.status}</span>
              </div>

              {selected?.id === m.id && (
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                      <span>Bin Capacity</span>
                      <span style={{ color: m.capacity > 80 ? "var(--red)" : "var(--green-light)" }}>{m.capacity}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${m.capacity}%`,
                        background: m.capacity > 80 ? "linear-gradient(90deg, #EF4444, #FCA5A5)" : undefined
                      }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={e => { e.stopPropagation(); setActiveTab("scan"); }}
                    >
                      Scan This Machine
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost btn-sm"
                      style={{ flex: 1, textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onClick={e => e.stopPropagation()}
                    >
                      Directions
                    </a>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
