export const user = {
  name: "Meet",
  email: "meet@jaydevgroup.com",
  city: "Ahmedabad",
  walletId: "GP-AHM-00142",
  points: 2350,
  bottles: 47,
  plastic: 4.2,
  co2: 8.1,
  trees: 0.4,
  level: "Bronze",
  referralCode: "MEET100",
};

export const transactions = [
  { id: 1, type: "earn", label: "Bottle Deposit", points: 5, date: "Today, 3:45 PM", machine: "GP-AHM-001" },
  { id: 2, type: "earn", label: "Bottle Deposit", points: 5, date: "Today, 11:20 AM", machine: "GP-AHM-003" },
  { id: 3, type: "bonus", label: "Referral Bonus", points: 100, date: "Yesterday", machine: null },
  { id: 4, type: "redeem", label: "Redeemed: Coffee Coupon", points: -500, date: "Mar 8", machine: null },
  { id: 5, type: "bonus", label: "Weekend Campaign Bonus", points: 50, date: "Mar 7", machine: null },
  { id: 6, type: "earn", label: "Bottle Deposit", points: 5, date: "Mar 7", machine: "GP-AHM-002" },
  { id: 7, type: "earn", label: "Bottle Deposit", points: 5, date: "Mar 6", machine: "GP-AHM-001" },
  { id: 8, type: "redeem", label: "Redeemed: Swiggy Voucher", points: -500, date: "Mar 5", machine: null },
];

export const rewards = [
  { id: 1, brand: "Swiggy", title: "₹50 Off on Orders", cost: 500, category: "food", color: "#FC8019", available: true },
  { id: 2, brand: "Amazon", title: "₹100 Gift Voucher", cost: 1000, category: "shopping", color: "#FF9900", available: true },
  { id: 3, brand: "Flipkart", title: "₹75 Off Coupon", cost: 750, category: "shopping", color: "#2874F0", available: true },
  { id: 4, brand: "Coffee Corner", title: "₹20 Off — Local", cost: 200, category: "food", color: "#6F4E37", available: true, local: true },
  { id: 5, brand: "Zomato", title: "₹30 Off on Food", cost: 300, category: "food", color: "#E23744", available: true },
  { id: 6, brand: "UPI Cash", title: "₹10 Cashback", cost: 100, category: "cash", color: "#16A34A", available: true },
  { id: 7, brand: "Donate", title: "100 pts to NGO", cost: 100, category: "donate", color: "#7C3AED", available: true },
  { id: 8, brand: "Mauli Paan", title: "Free Premium Paan", cost: 300, category: "food", color: "#16A34A", available: true, local: true },
];

export const machines = [
  { id: "GP-AHM-001", name: "Frizbee Food Park", lat: 23.0225, lng: 72.5714, status: "available", capacity: 60, distance: "0.8 km" },
  { id: "GP-AHM-002", name: "Bodakdev Circle", lat: 23.0395, lng: 72.5260, status: "available", capacity: 30, distance: "2.1 km" },
  { id: "GP-AHM-003", name: "SG Highway Mall", lat: 23.0469, lng: 72.5063, status: "full", capacity: 95, distance: "3.4 km" },
  { id: "GP-AHM-004", name: "Vastrapur Lake", lat: 23.0327, lng: 72.5283, status: "available", capacity: 45, distance: "2.8 km" },
  { id: "GP-AHM-005", name: "Iscon Temple Rd", lat: 23.0276, lng: 72.5084, status: "offline", capacity: 0, distance: "4.2 km" },
];

export const badges = [
  { id: 1, icon: "🌱", name: "First Bottle", desc: "Recycled your first bottle", unlocked: true },
  { id: 2, icon: "🔟", name: "10 Bottles", desc: "Recycled 10 bottles", unlocked: true },
  { id: 3, icon: "⭐", name: "50 Bottles", desc: "Recycled 50 bottles", unlocked: false },
  { id: 4, icon: "🦸", name: "Eco Hero", desc: "Recycled 100 bottles", unlocked: false },
  { id: 5, icon: "⚔️", name: "Plastic Warrior", desc: "Recycled 500 bottles", unlocked: false },
  { id: 6, icon: "🏆", name: "Green Champion", desc: "Recycled 1000 bottles", unlocked: false },
];

export const leaderboard = [
  { rank: 1, name: "Rahul S.", bottles: 250, isUser: false },
  { rank: 2, name: "Priya M.", bottles: 210, isUser: false },
  { rank: 3, name: "Meet S.", bottles: 180, isUser: true },
  { rank: 4, name: "Ankit D.", bottles: 150, isUser: false },
  { rank: 5, name: "Sneha R.", bottles: 120, isUser: false },
];

export const campaigns = [
  { id: 1, title: "Daily Dash", desc: "Recycle 10 bottles today", reward: "+50 GreenPoints", progress: 4, target: 10, deadline: "Ends tonight", active: true },
  { id: 2, title: "Weekend Warrior", desc: "Recycle 30 bottles this weekend", reward: "₹100 Voucher", progress: 18, target: 30, deadline: "2 days left", active: true },
  { id: 3, title: "March Madness", desc: "Top recycler of March wins ₹500", reward: "₹500 Cash Prize", progress: 47, target: 200, deadline: "21 days left", active: true },
];
