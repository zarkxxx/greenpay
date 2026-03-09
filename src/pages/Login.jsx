import { useEffect, useRef } from "react";

export default function Login({ onLogin }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)", borderRadius: "50%", zIndex: 0, animation: "breathe 4s ease-in-out infinite" }} />
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.6; }
          50% { transform: translateX(-50%) scale(1.2); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1, padding: "0 28px 48px", justifyContent: "flex-end" }}>
        <div style={{ position: "absolute", top: 60, left: 28, animation: "fadeUp 0.8s ease forwards" }}>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 15, fontWeight: 600, color: "var(--green-light)", letterSpacing: "3px", textTransform: "uppercase" }}>
            GreenPay
          </div>
        </div>
        <div style={{ animation: "fadeUp 0.8s ease 0.2s both" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 36, fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>
              Recycle.<br />Earn.<br />Redeem.
            </div>
            <div style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.6 }}>
              Turn plastic bottles into rewards,<br />vouchers, and real cash.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15 }} onClick={onLogin}>
              Continue with Google
            </button>
            <button className="btn-ghost" style={{ width: "100%", fontSize: 15 }} onClick={onLogin}>
              Continue with Phone OTP
            </button>
            <button style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 13, cursor: "pointer", padding: "8px", fontFamily: "DM Sans, sans-serif" }} onClick={onLogin}>
              Continue as Guest (Demo Mode)
            </button>
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", marginTop: 16 }}>
            By continuing you agree to our Terms & Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}