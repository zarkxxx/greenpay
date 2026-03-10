import { useState, useEffect } from "react";
import { rewards } from "../data/mockData";
import { useAuth } from "../lib/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "firebase/firestore";

export default function Rewards({ points, redeemPoints, redeemedCoupons, defaultView }) {
  const [cat, setCat] = useState("all");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [view, setView] = useState(defaultView || "marketplace");
  const [firestoreCoupons, setFirestoreCoupons] = useState([]);

  const { user } = useAuth();
  const isDemoMode = localStorage.getItem("gp_demo_mode") === "true";

  const cats = ["all", "food", "shopping", "cash", "donate"];
  const filtered = rewards.filter(r => cat === "all" || r.category === cat);

  useEffect(() => {
    if (defaultView) setView(defaultView);
  }, [defaultView]);

  useEffect(() => {
    if (user && !isDemoMode) {
      getDocs(query(collection(db, "profiles", user.uid, "coupons"), orderBy("redeemedAt", "desc")))
        .then(snap => setFirestoreCoupons(snap.docs.map(d => ({
          ...d.data(),
          id: d.id,
          redeemedAt: d.data().redeemedAt?.toDate?.()?.toLocaleDateString() || "Recently",
        }))))
        .catch(() => {});
    }
  }, [user]);

  const displayCoupons = (user && !isDemoMode) ? firestoreCoupons : redeemedCoupons;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleRedeem = async (reward) => {
    const ok = await redeemPoints(reward.cost, reward);
    if (ok) {
      setModal(null);

      // Donate category — no coupon, just toast
      if (reward.category === "donate") {
        showToast(`💚 Donated ${reward.cost} GP to NGO. Thank you!`);
        return;
      }

      const code = `GP-${reward.brand.toUpperCase().slice(0, 4)}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      showToast(`🎉 Redeemed: ${reward.title}`);

      if (user && !isDemoMode) {
        try {
          const docRef = await addDoc(collection(db, "profiles", user.uid, "coupons"), {
            title: reward.title,
            brand: reward.brand,
            cost: reward.cost,
            code,
            redeemedAt: serverTimestamp(),
          });
          setFirestoreCoupons(prev => [{
            id: docRef.id,
            title: reward.title,
            brand: reward.brand,
            cost: reward.cost,
            code,
            redeemedAt: new Date().toLocaleDateString(),
          }, ...prev]);
        } catch (e) {
          console.error("Failed to save coupon:", e);
        }
      }
    } else {
      showToast("Insufficient GreenPoints", "error");
      setModal(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header" style={{ paddingTop: 52 }}>
        <div className="page-title">Rewards</div>
        <button
          style={{ marginLeft: "auto", fontSize: 13, color: "var(--green-light)", background: "none", border: "none", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}
          onClick={() => setView(v => v === "marketplace" ? "coupons" : "marketplace")}
        >
          {view === "marketplace" ? "My Coupons" : "← Marketplace"}
        </button>
      </div>

      {view === "coupons" ? (
        <div style={{ padding: "0 20px" }}>
          <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
            {displayCoupons.length} active coupon{displayCoupons.length !== 1 ? "s" : ""}
          </div>
          {displayCoupons.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎫</div>
              <div style={{ marginBottom: 20 }}>No coupons yet. Redeem rewards to get started.</div>
              <button className="btn-primary" onClick={() => setView("marketplace")}>Browse Rewards</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {displayCoupons.map((c, i) => (
                <div key={c.id || i} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{c.title}</div>
                      <div style={{ fontSize: 13, color: "var(--text2)" }}>{c.brand}</div>
                    </div>
                    <span className="tag tag-green">Active</span>
                  </div>
                  <div style={{ background: "var(--bg)", border: "1px dashed var(--border)", borderRadius: 10, padding: "10px 14px", fontFamily: "monospace", fontSize: 14, color: "var(--green-light)", letterSpacing: "1px", textAlign: "center" }}>
                    {c.code}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8, textAlign: "center" }}>
                    Redeemed {c.redeemedAt} · Expires in 7 days
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: "0 20px" }}>
          <div style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "var(--text2)" }}>Your balance</span>
            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 18, color: "var(--green-light)" }}>
              {points.toLocaleString()} GP
            </span>
          </div>

          <div className="cat-tabs" style={{ marginBottom: 16 }}>
            {cats.map(c => (
              <button key={c} className={`cat-tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          <div className="rewards-grid">
            {filtered.map(r => (
              <div key={r.id} className="reward-card">
                {r.local && <span className="tag tag-green" style={{ fontSize: 10, marginBottom: 4 }}>LOCAL</span>}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="reward-brand-circle" style={{ background: r.color }}>
                    {r.brand.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)" }}>{r.brand}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ marginTop: "auto" }}>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6 }}>
                    {r.cost.toLocaleString()} GreenPoints
                  </div>
                  <button
                    className="btn-primary btn-sm"
                    style={{ width: "100%", opacity: points >= r.cost ? 1 : 0.5 }}
                    onClick={() => setModal(r)}
                  >
                    {r.category === "donate" ? "Donate" : "Redeem"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div className="reward-brand-circle" style={{ background: modal.color, width: 52, height: 52, fontSize: 16, borderRadius: 12 }}>
                {modal.brand.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 18 }}>{modal.title}</div>
                <div style={{ fontSize: 13, color: "var(--text2)" }}>{modal.brand}</div>
              </div>
            </div>
            {modal.category === "donate" && (
              <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 13, color: "var(--text2)" }}>
                💚 Your points will be converted to a donation to an environmental NGO. No coupon is issued.
              </div>
            )}
            <div style={{ background: "var(--bg2)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "var(--text2)", fontSize: 14 }}>Cost</span>
                <span style={{ fontWeight: 700, color: "var(--green-light)" }}>{modal.cost} GP</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text2)", fontSize: 14 }}>Balance after</span>
                <span style={{ fontWeight: 700, color: points - modal.cost < 0 ? "var(--red)" : "var(--text)" }}>
                  {(points - modal.cost).toLocaleString()} GP
                </span>
              </div>
            </div>
            <button
              className="btn-primary"
              style={{ width: "100%", marginBottom: 10, opacity: points >= modal.cost ? 1 : 0.5 }}
              onClick={() => points >= modal.cost && handleRedeem(modal)}
            >
              {modal.category === "donate" ? "Confirm Donation" : "Confirm Redemption"}
            </button>
            <button className="btn-ghost" style={{ width: "100%" }} onClick={() => setModal(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}