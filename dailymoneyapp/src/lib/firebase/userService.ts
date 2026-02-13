import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { UserProfile } from '@/types';

const USERS_COLLECTION = 'users';

/**
 * Create user profile in Firestore
 */
export async function createUserProfile(
  userId: string,
  data: {
    email: string;
    name: string;
    monthlyIncome?: number;
  }
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);

  await setDoc(userRef, {
    email: data.email,
    name: data.name,
    monthlyIncome: data.monthlyIncome || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  const data = userSnap.data();
  return {
    id: userSnap.id,
    email: data.email,
    name: data.name,
    monthlyIncome: data.monthlyIncome || 0,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    name: string;
    monthlyIncome: number;
  }>
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);

  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update monthly income
 */
export async function updateMonthlyIncome(
  userId: string,
  income: number
): Promise<void> {
  await updateUserProfile(userId, { monthlyIncome: income });
}
