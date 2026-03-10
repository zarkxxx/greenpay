import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const canvasRef = useRef(null);

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        skipBrowserRedirect: true,
      },
    });
  
    if (error) {
      console.error(error);
      return;
    }

    if (data?.url) {
      const popup = window.open(data.url, "google-login", "width=500,height=600,scrollbars=yes");
    
      // Poll for popup close and check session
      const timer = setInterval(async () => {
        if (popup?.closed) {
          clearInterval(timer);
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            window.location.reload();
          }
        }
      }, 500);
    }
  };

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
            <button
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", fontSize: 15, display: "flex", alignItems: "center", gap: 10 }}
              onClick={handleGoogleLogin}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
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