import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import Rewards from "./pages/Rewards";
import MapPage from "./pages/MapPage";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Gamification from "./pages/Gamification";
import Campaigns from "./pages/Campaigns";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

function AppInner() {
  const { user, loading, signOut, profile } = useAuth();
  const isDemoMode = localStorage.getItem("gp_demo_mode") === "true";

  const [screen, setScreen] = useState(() => {
    const onboarded = localStorage.getItem("gp_onboarded");
    return onboarded ? "login" : "onboarding";
  });
  const [activeTab, setActiveTab] = useState("home");
  const [points, setPoints] = useState(0);
  const [bottles, setBottles] = useState(0);
  const [notifications, setNotifications] = useState(3);
  const [redeemedCoupons, setRedeemedCoupons] = useState([]);

  useEffect(() => {
    if (!loading) {
      if (user || isDemoMode) setScreen("app");
      else if (localStorage.getItem("gp_onboarded")) setScreen("login");
    }
  }, [user, loading, isDemoMode]);
  
  useEffect(() => {
    if (profile) {
      setPoints(profile.points ?? 0);
      setBottles(profile.bottles ?? 0);
    } else if (isDemoMode) {
      setPoints(2350);
      setBottles(47);
    }
  }, [profile, isDemoMode]);

  const addPoints = (pts) => {
    setPoints(p => p + pts);
    setBottles(b => b + 1);
  };

  const redeemPoints = (cost, reward) => {
    if (points >= cost) {
      setPoints(p => p - cost);
      setRedeemedCoupons(c => [...c, {
        ...reward,
        redeemedAt: new Date().toLocaleDateString(),
        code: `GP-${reward.brand.toUpperCase().slice(0, 4)}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      }]);
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    localStorage.removeItem("gp_demo_mode");
    await signOut();
    setActiveTab("home");
    setScreen("login");
  };

  const handleOnboardingDone = () => {
    localStorage.setItem("gp_onboarded", "true");
    setScreen("login");
  };

  if (loading && !isDemoMode) return <div style={{ background: "#080808", minHeight: "100vh" }} />;
  if (screen === "onboarding") return <Onboarding onDone={handleOnboardingDone} />;
  if (screen === "login") return <Login />;

  const demoUser = { name: "Demo User", email: "demo@greenpay.app", avatar: null };
  const firebaseUser = user ? {
    name: user.displayName || user.email,
    email: user.email,
    avatar: user.photoURL,
  } : null;
  const currentUser = isDemoMode ? demoUser : firebaseUser;

  const tabs = [
    { id: "home", icon: HomeIcon, label: "Home" },
    { id: "scan", icon: ScanIcon, label: "Scan" },
    { id: "rewards", icon: GiftIcon, label: "Rewards" },
    { id: "map", icon: MapIcon, label: "Map" },
    { id: "profile", icon: UserIcon, label: "Profile" },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "home": return <Home points={points} bottles={bottles} setActiveTab={setActiveTab} user={currentUser} />;
      case "scan": return <Scan addPoints={addPoints} />;
      case "rewards": return <Rewards points={points} redeemPoints={redeemPoints} redeemedCoupons={redeemedCoupons} />;
      case "map": return <MapPage setActiveTab={setActiveTab} />;
      case "profile": return <Profile points={points} bottles={bottles} setActiveTab={setActiveTab} redeemedCoupons={redeemedCoupons} notifications={notifications} onLogout={handleLogout} user={currentUser} isDemoMode={isDemoMode} />;
      case "wallet": return <Wallet points={points} setActiveTab={setActiveTab} userId={user?.uid} />;
      case "gamification": return <Gamification bottles={bottles} points={points} setActiveTab={setActiveTab} />;
case "campaigns": return <Campaigns setActiveTab={setActiveTab} bottles={bottles} />;
      default: return <Home points={points} bottles={bottles} setActiveTab={setActiveTab} user={currentUser} />;
    }
  };

  return (
    <div className="app-shell">
      <div className="app-content">{renderTab()}</div>
      <nav className="bottom-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon />
            <span>{tab.label}</span>
            {tab.id === "profile" && notifications > 0 && (
              <span className="notif-badge">{notifications}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

function HomeIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
}
function ScanIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13 0h-2v2h2v2h-2v2h2v-2h2v2h2v-2h-2v-2h2v-2h-4v-2h2V13h-2v2z"/></svg>;
}
function GiftIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.33.18-.65.18-1 0-2.21-1.79-4-4-4-1.31 0-2.44.64-3.16 1.6L10 4.27 9.16 2.6C8.44 1.64 7.31 1 6 1 3.79 1 2 2.79 2 5c0 .35.11.67.18 1H0v2h1v11a2 2 0 002 2h18a2 2 0 002-2V8h1V6h-4zm-4-3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-6 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm11 16H3V8h18v11z"/></svg>;
}
function MapIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>;
}
function UserIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
}