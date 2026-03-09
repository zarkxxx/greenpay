import { useState } from "react";

const slides = [
  { emoji: "♻️", title: "Recycle Bottles", sub: "Drop plastic bottles into GreenPay machines across the city" },
  { emoji: "🪙", title: "Earn GreenPoints", sub: "Every bottle earns you points instantly, tracked in real-time" },
  { emoji: "🎁", title: "Redeem & Cash Out", sub: "Vouchers, UPI payouts, local deals — spend your green earnings" },
];

export default function Onboarding({ onDone }) {
  const [idx, setIdx] = useState(0);

  const next = () => {
    if (idx < slides.length - 1) setIdx(idx + 1);
    else onDone();
  };

  const slide = slides[idx];

  return (
    <div className="onboarding">
      <button
        style={{ alignSelf: "flex-end", background: "none", border: "none", color: "var(--text2)", fontSize: 15, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
        onClick={onDone}
      >
        Skip
      </button>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div className="onboarding-illustration">{slide.emoji}</div>
        <div>
          <h1>{slide.title}</h1>
          <p>{slide.sub}</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, width: "100%" }}>
        <div className="dots">
          {slides.map((_, i) => (
            <div key={i} className={`dot ${i === idx ? "active" : ""}`} />
          ))}
        </div>
        <button className="btn-primary" style={{ width: "100%" }} onClick={next}>
          {idx < slides.length - 1 ? "Next" : "Get Started →"}
        </button>
      </div>
    </div>
  );
}
