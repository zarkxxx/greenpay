# GreenPay 🌿

Fintech-style recycling rewards app. Recycle bottles → Earn GreenPoints → Redeem rewards.

**Design:** CRED + sustainability. Dark theme, green accents.

---

## Local Development

```bash
npm install
npm run dev
```

Open: http://localhost:5173

---

## Build for Production

```bash
npm run build
```

Output: `dist/` folder — upload this to Hostinger.

---

## Deploy to Hostinger

### Option A — Manual Upload
1. Run `npm run build`
2. Open Hostinger → File Manager → `public_html/`
3. Delete existing files
4. Upload all files from `dist/` folder

### Option B — Auto Deploy via GitHub Actions (Recommended)

1. Push this repo to GitHub
2. Go to: GitHub Repo → Settings → Secrets and variables → Actions
3. Add these secrets:
   - `FTP_SERVER` → your Hostinger FTP host (e.g. `ftp.yourdomain.com`)
   - `FTP_USERNAME` → your Hostinger FTP username
   - `FTP_PASSWORD` → your Hostinger FTP password
4. Every push to `main` will auto-build and deploy

**Where to find Hostinger FTP credentials:**
Hostinger Panel → Hosting → your site → FTP Accounts

---

## App Structure

```
src/
├── pages/
│   ├── Onboarding.jsx     # 3-slide intro
│   ├── Login.jsx          # Auth screen
│   ├── Home.jsx           # Dashboard
│   ├── Scan.jsx           # QR scan + machine code
│   ├── Rewards.jsx        # Marketplace + My Coupons
│   ├── MapPage.jsx        # Nearby machines
│   ├── Wallet.jsx         # Transaction history
│   ├── Gamification.jsx   # Leaderboard + badges + levels
│   ├── Campaigns.jsx      # Active challenges
│   └── Profile.jsx        # User profile + referral
├── data/
│   └── mockData.js        # All mock data
├── App.jsx                # Root + navigation
└── index.css              # Global styles
```

---

## Phase 2 Roadmap (Backend)
- Supabase auth (replace mock login)
- Real-time points via machine webhook
- UPI payout integration
- Vendor admin panel
- Push notifications (Firebase)
