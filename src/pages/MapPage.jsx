import { useState } from "react";
import { machines } from "../data/mockData";

export default function MapPage({ setActiveTab }) {
  const [selected, setSelected] = useState(null);

  const statusBg = { available: "tag-green", full: "tag-red", offline: "tag-gray" };

  // Build Google Maps embed URL with all machine markers
  const mapSrc = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBnEhuV0yJlMMvSOKwPXp7U6MhCNeFlkc0&q=recycling+machines+Ahmedabad&center=23.0300,72.5200&zoom=13`;

  // Static map with markers using Maps Static API
  const markerParams = machines.map((m, i) => 
    `markers=color:${m.status === "available" ? "green" : m.status === "full" ? "red" : "gray"}%7Clabel:${i+1}%7C${m.lat},${m.lng}`
  ).join("&");

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=23.0300,72.5200&zoom=13&size=600x260&scale=2&maptype=roadmap&style=element:geometry%7Ccolor:0x1a1a1a&style=element:labels.text.fill%7Ccolor:0x757575&style=element:labels.text.stroke%7Ccolor:0x212121&style=feature:road%7Celement:geometry%7Ccolor:0x2c2c2c&style=feature:water%7Celement:geometry%7Ccolor:0x000000&${markerParams}&key=AIzaSyBnEhuV0yJlMMvSOKwPXp7U6MhCNeFlkc0`;

  return (
    <div className="page">
      <div className="page-header" style={{ paddingTop: 52 }}>
        <div className="page-title">Nearby Machines</div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Static map with machine markers */}
        <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16, border: "1px solid var(--border)", position: "relative" }}>
          <img
            src={staticMapUrl}
            alt="Machine locations map"
            style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
            onError={(e) => {
              // Fallback to iframe if static map fails
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          {/* Fallback iframe */}
          <iframe
            title="GreenPay Machines Map"
            width="100%"
            height="240"
            style={{ border: "none", display: "none", filter: "invert(0.9) hue-rotate(180deg)" }}
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14693!2d72.5200!3d23.0300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
          />
          
            href={`https://www.google.com/maps/search/recycling+machines/@23.0300,72.5200,14z`}
            target="_blank"
            rel="noreferrer"
            style={{
              position: "absolute", top: 10, left: 10,
              background: "rgba(0,0,0,0.7)", color: "white",
              fontSize: 12, padding: "6px 12px", borderRadius: 8,
              textDecoration: "none", backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            Open in Maps ↗
          </a>
          {/* Machine number legend */}
          <div style={{
            position: "absolute", bottom: 10, right: 10,
            background: "rgba(0,0,0,0.75)", borderRadius: 8, padding: "6px 10px",
            backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)"
          }}>
            {machines.map((m, i) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "white", marginBottom: i < machines.length - 1 ? 3 : 0 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: m.status === "available" ? "#16A34A" : m.status === "full" ? "#EF4444" : "#6B7280",
                  color: "white"
                }}>{i + 1}</div>
                <span style={{ color: m.status === "available" ? "#86efac" : m.status === "full" ? "#fca5a5" : "#9ca3af" }}>
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>
          {machines.filter(m => m.status === "available").length} machines available near you
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {machines.map((m, i) => (
            <button
              key={m.id}
              className="card"
              style={{
                width: "100%", textAlign: "left", cursor: "pointer",
                border: selected?.id === m.id ? "1px solid var(--green)" : "1px solid var(--border)",
                background: "var(--card)", opacity: m.status === "offline" ? 0.6 : 1
              }}
              onClick={() => setSelected(selected?.id === m.id ? null : m)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: selected?.id === m.id ? 12 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, position: "relative",
                    background: m.status === "available" ? "rgba(22,163,74,0.15)" : "rgba(239,68,68,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
                  }}>
                    🗑️
                    <div style={{
                      position: "absolute", top: -4, right: -4,
                      width: 16, height: 16, borderRadius: "50%",
                      background: m.status === "available" ? "#16A34A" : m.status === "full" ? "#EF4444" : "#6B7280",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700, color: "white"
                    }}>{i + 1}</div>
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
                    {m.status === "available" ? (
                      <button
                        className="btn-primary btn-sm"
                        style={{ flex: 1 }}
                        onClick={e => { e.stopPropagation(); setActiveTab("scan"); }}
                      >
                        Scan This Machine
                      </button>
                    ) : (
                      <div style={{ flex: 1, textAlign: "center", fontSize: 13, color: "var(--text3)", padding: "8px 0" }}>
                        {m.status === "full" ? "Machine full — cannot accept bottles" : "Machine offline"}
                      </div>
                    )}
                    
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