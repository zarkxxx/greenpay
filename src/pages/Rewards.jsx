import { useState, useEffect } from "react";
import { rewards } from "../data/mockData";
import { useAuth } from "../lib/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "firebase/firestore";
import Skeleton from "../components/Skeleton";

export default function Rewards({ points, redeemPoints, redeemedCoupons, defaultView }) {
  const [cat, setCat] = useState("all");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [view, setView] = useState(defaultView || "marketplace");
  const [firestoreCoupons, setFirestoreCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  const { user } = useAuth();
  const isDemoMode = localStorage.getItem("gp_demo_mode") === "true";

  const cats = ["all", "food", "shopping", "cash", "donate"];
  const filtered = rewards.filter(r => cat === "all" || r.category === cat);

  useEffect(() => {
    if (defaultView) setView(defaultView);
  }, [defaultView]);

  useEffect(() => {
    if (user && !isDemoMode) {
      setLoadingCoupons(true);
      getDocs(query(collection(db, "profiles", user.uid, "coupons"), orderBy("redeemedAt", "desc")))
        .then(snap => setFirestoreCoupons(snap.docs.map(d => ({
          ...d.data(),
          id: d.id,
          redeemedAt: d.data().redeemedAt?.toDate?.()?.toLocaleDateString() || "Recently",
        }))))
        .catch(() => {})
        .finally(() => setLoadingCoupons(false));
    }
  }, [user]);

  const displayCoupons = (user && !isDemoMode) ? firestoreCoupons : redeemedCoupons;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleRedeem = async (reward) => {
    const ok = await redeemPoints(reward.cost, reward);
    if (!ok) {
      showToast("Insufficient GreenPoints", "error");
      setModal(null);
      return;
    }

    setModal(null);

    if (reward.category === "donate") {
      showToast(`💚 Donated ${reward.cost} GP to NGO. Thank you!`);
      return;
    }

    const code = `GP-${reward.brand.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4)}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    showToast(`🎉 Redeemed: ${reward.title}`);

    // Always update local state first so it shows immediately
    const newCoupon = {
      id: `local-${Date.now()}`,
      title: reward.title,
      brand: reward.brand,
      category: reward.category,
      cost: reward.cost,
      code,
      redeemedAt: new Date().toLocaleDateString(),
    };

    if (user && !isDemoMode) {
      try {
        const docRef = await addDoc(collection(db, "profiles", user.uid, "coupons"), {
          title: reward.title,
          brand: reward.brand,
          category: reward.category,
          cost: reward.cost,
          code,
          redeemedAt: serverTimestamp(),
        });
        setFirestoreCoupons(prev => [{ ...newCoupon, id: docRef.id }, ...prev]);
      } catch (e) {
        console.error("Failed to save coupon:", e);
        // Still show locally even if Firestore fails
        setFirestoreCoupons(prev => [newCoupon, ...prev]);
      }
    }
  };

  const categoryIcon = { food: "🍔", shopping: "🛍️", cash: "💵", donate: "💚" };

  return (
    <div className="page">
      {/* Header — only show toggle when in marketplace, show back when in coupons */}
      <div className="page-header" style={{ paddingTop: 52 }}>
        {view === "coupons" ? (
          <>
            <button
              className="back-btn"
              onClick={() => setView("marketplace")}
            >‹</button>
            <div className="page-title">My Coupons</div>
          </>
        ) : (
          <>
            <div className="page-title">Rewards</div>
            <button
              style={{ marginLeft: "auto", fontSize: 13, color: "var(--green-light)", background: "none", border: "none", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}
              onClick={() => setView("coupons")}
            >
              My Coupons
            </button>
          </>
        )}
      </div>

      {view === "coupons" ? (
        <div style={{ padding: "0 20px" }}>
          <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
            {displayCoupons.length} active coupon{displayCoupons.length !== 1 ? "s" : ""}
          </div>

          {loadingCoupons ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Skeleton width="36px" height="36px" style={{ borderRadius: "8px" }} />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="60%" height="14px" style={{ marginBottom: 4 }} />
                    <Skeleton width="40%" height="12px" />
                  </div>
                  <Skeleton width="50px" height="20px" />
                </div>
              ))}
            </div>
          ) : displayCoupons.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "80px 20px", textAlign: "center", color: "var(--text3)"
            }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎫</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>No coupons yet</div>
              <div style={{ fontSize: 13, marginBottom: 0 }}>Redeem rewards from the marketplace to get started.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {displayCoupons.map((c, i) => (
                <div key={c.id || i} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, fontSize: 18,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(22,163,74,0.1)"
                      }}>
                        {categoryIcon[c.category] || "🎁"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: "var(--text2)" }}>{c.brand}</div>
                      </div>
                    </div>
                    <span className="tag tag-green">Active</span>
                  </div>
                  <div style={{
                    background: "var(--bg)", border: "1px dashed var(--green)",
                    borderRadius: 10, padding: "10px 14px",
                    fontFamily: "monospace", fontSize: 15,
                    color: "var(--green-light)", letterSpacing: "2px", textAlign: "center",
                    fontWeight: 700
                  }}>
                    {c.code}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 8, textAlign: "center" }}>
                    Redeemed {c.redeemedAt} · Expires in 7 days
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: "0 20px" }}>
          {/* Balance bar */}
          <div style={{
            background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)",
            borderRadius: 12, padding: "12px 16px", marginBottom: 16,
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span style={{ fontSize: 14, color: "var(--text2)" }}>Your balance</span>
            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 18, color: "var(--green-light)" }}>
              {points.toLocaleString()} GP
            </span>
          </div>

          {/* Category tabs */}
          <div className="cat-tabs" style={{ marginBottom: 16 }}>
            {cats.map(c => (
              <button key={c} className={`cat-tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          {/* Rewards grid */}
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
                    {r.cost.toLocaleString()} GP
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

      {/* Confirm modal */}
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
              <div style={{
                background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
                borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 13, color: "var(--text2)"
              }}>
                💚 Points will be donated to an environmental NGO. No coupon issued.
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