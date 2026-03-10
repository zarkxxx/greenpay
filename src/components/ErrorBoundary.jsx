import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong</div>
        <div style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Please refresh the app to continue.</div>
        <button onClick={() => window.location.reload()} style={{ background: "#16A34A", color: "white", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 15, cursor: "pointer" }}>
          Refresh
        </button>
      </div>
    );
    return this.props.children;
  }
}