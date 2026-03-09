export default function Login({ onLogin }) {
  return (
    <div className="login-page">
      <div className="logo-area">
        <div className="logo-icon">🌿</div>
        <div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, fontWeight: 800 }}>GreenPay</div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>Recycle. Earn. Redeem.</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>
            Welcome back 🌱
          </div>
          <div style={{ fontSize: 15, color: "var(--text2)", marginTop: 8 }}>
            Sign in to track your impact and earn rewards
          </div>
        </div>

        <button
          className="btn-ghost"
          style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-start", padding: "16px 20px" }}
          onClick={onLogin}
        >
          <span style={{ fontSize: 20 }}>🔵</span>
          <span>Continue with Google</span>
        </button>

        <button
          className="btn-ghost"
          style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-start", padding: "16px 20px" }}
          onClick={onLogin}
        >
          <span style={{ fontSize: 20 }}>📱</span>
          <span>Continue with Phone OTP</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text3)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <button
          className="btn-ghost"
          style={{ color: "var(--text2)", fontSize: 14 }}
          onClick={onLogin}
        >
          Continue as Guest (Demo Mode)
        </button>
      </div>

      <div style={{ textAlign: "center", fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
        By continuing you agree to our Terms & Privacy Policy
      </div>
    </div>
  );
}
