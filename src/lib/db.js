import { db } from "./firebase";
import {
  doc, getDoc, updateDoc, collection,
  addDoc, getDocs, query, orderBy,
  limit, serverTimestamp, increment
} from "firebase/firestore";

export const getProfile = async (userId) => {
  const snap = await getDoc(doc(db, "profiles", userId));
  return snap.exists() ? snap.data() : null;
};

export const addPoints = async (userId, points, description = "Bottle recycled") => {
  const ref = doc(db, "profiles", userId);
  await updateDoc(ref, { points: increment(points), bottles: increment(1) });
  await addDoc(collection(db, "profiles", userId, "transactions"), {
    type: "earn",
    points,
    description,
    createdAt: serverTimestamp(),
  });
};

export const redeemPoints = async (userId, points, description = "Reward redeemed") => {
  const ref = doc(db, "profiles", userId);
  await updateDoc(ref, { points: increment(-points) });
  await addDoc(collection(db, "profiles", userId, "transactions"), {
    type: "redeem",
    points: -points,
    description,
    createdAt: serverTimestamp(),
  });
};

export const getTransactions = async (userId) => {
  const q = query(
    collection(db, "profiles", userId, "transactions"),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getLeaderboard = async () => {
  const q = query(collection(db, "profiles"), orderBy("points", "desc"), limit(10));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};