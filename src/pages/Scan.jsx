import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { addPoints as addPointsDB } from "../lib/db";

const VALID_MACHINES = ["GP-AHM-001", "GP-AHM-002", "GP-AHM-003", "GP-AHM-004", "GP-AHM-005"];

export default function Scan({ addPoints }) {
  const { user } = useAuth();
  const isDemoMode = localStorage.getItem("gp_demo_mode") === "true";
  const [state, setState] = useState("options");
  const [code, setCode] = useState("");
  const [machineId, setMachineId] = useState("GP-AHM-001");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  
  const awardPoints = async (machine) => {
    setSaving(true);
    try {
      if (user && !isDemoMode) {
        await addPointsDB(user.uid, 5, `Bottle recycled at ${machine}`);
      }
      addPoints(5); // update local state
      setMachineId(machine);
      setState("success");
    } catch (e) {
      console.error(e);
      setState("success"); // still show success, local state updated
    } finally {
      setSaving(false);
    }
  };

  const handleScan = () => {
    setState("scanning");
    setTimeout(() => {
      awardPoints("GP-AHM-001");
    }, 1500);
  };

  const handleCode = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    if (!VALID_MACHINES.includes(trimmed)) {
      setError("Invalid machine code. Check the ID on the machine.");
      return;
    }
    setError("");
    awardPoints(trimmed);
  };

  if (state === "scanning") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 24, padding: 40 }}>
        <div style={{ width: 220, height: 220, border: "2px solid var(--green)", borderRadius: 20, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--green-light)", animation: "scan 1.5s ease-in-out infinite", boxShadow: "0 0 8px var(--green-light)" }} />
          <style>{`@keyframes scan { 0%,100% { top: 0 } 50% { top: calc(100% - 2px) } }`}</style>
          <div style={{ fontSize: 48, opacity: 0.3 }}>📷</div>
          {["tl","tr","bl","br"].map(pos => (
            <div key={pos} style={{ position: "absolute", width: 20, height: 20, borderColor: "var(--green-light)", borderStyle: "solid",
              ...(pos === "tr" ? { top: -2, right: -2, borderWidth: "2px 2px 0 0" } :
                pos === "tl" ? { top: -2, left: -2, borderWidth: "2px 0 0 2px" } :
                pos === "br" ? { bottom: -2, right: -2, borderWidth: "0 2px 2px 0" } :
                { bottom: -2, left: -2, borderWidth: "0 0 2px 2px" })
            }} />
          ))}
        </div>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text2)" }}>
          {saving ? "Saving points..." : "Scanning QR Code..."}
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="success-screen">
        <div className="success-circle">✅</div>
        <div>
          <div className="success-pts">+5 GreenPoints</div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 20, fontWeight: 700, marginTop: 4 }}>Bottle Recycled!</div>
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px", fontSize: 13, color: "var(--text2)", textAlign: "center" }}>
          Machine: {machineId} · {new Date().toLocaleTimeString()}
        </div>
        <button className="btn-primary" style={{ width: "100%", maxWidth: 300 }} onClick={() => { setState("options"); setCode(""); setError(""); }}>
          Recycle Another ♻️
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header" style={{ paddingTop: 52 }}>
        <div className="page-title">Recycle a Bottle</div>
      </div>
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>Choose how to connect to a machine:</div>

        <button className="scan-option" onClick={handleScan}>
          <div className="scan-icon-wrap">📷</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>Scan QR Code</div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>Point camera at the machine QR</div>
          </div>
          <div style={{ marginLeft: "auto", color: "var(--text3)" }}>›</div>
        </button>

        <div className="scan-option" style={{ flexDirection: "column", alignItems: "stretch", cursor: "default" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div className="scan-icon-wrap">🔢</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>Enter Machine Code</div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>Type the ID shown on machine</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={code}
              onChange={e => { setCode(e.target.value); setError(""); }}
              placeholder="e.g. GP-AHM-001"
              style={{ flex: 1, background: "var(--bg2)", border: `1px solid ${error ? "var(--red)" : "var(--border)"}`, borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none" }}
            />
            <button className="btn-primary" style={{ padding: "10px 16px", fontSize: 14 }} onClick={handleCode}>Go</button>
          </div>
          {error && <div style={{ fontSize: 12, color: "var(--red)", marginTop: 6 }}>{error}</div>}
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 8 }}>
            Valid codes: GP-AHM-001 through GP-AHM-005
          </div>
        </div>

        <button className="scan-option" style={{ opacity: 0.5 }}>
          <div className="scan-icon-wrap">📶</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>NFC Tap</div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>Tap your phone on the machine</div>
          </div>
          <span className="tag tag-gray" style={{ marginLeft: "auto" }}>Soon</span>
        </button>

        <div style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 12, padding: 16, marginTop: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>💡 How it works</div>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
            1. Find a GreenPay machine near you<br/>
            2. Deposit your plastic bottle<br/>
            3. Scan / enter code to confirm<br/>
            4. Earn 5 GreenPoints instantly
          </div>
        </div>
      </div>
    </div>
  );
}