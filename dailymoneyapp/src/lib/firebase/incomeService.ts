import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from './config';
import { Income } from '@/types';
import { allocateIncome } from './jarService';
import { JAR_DEFINITIONS, calculateJarAllocation } from '@/lib/constants/jars';

const USERS_COLLECTION = 'users';
const INCOMES_COLLECTION = 'incomes';

/**
 * Add income and allocate to jars
 */
export async function addIncome(
  userId: string,
  incomeData: {
    amount: number;
    source: string;
    note?: string;
    category?: string;
    description?: string;
    autoAllocate?: boolean;
  }
): Promise<string> {
  // Calculate allocation for each jar
  const allocated: { [jarCode: string]: number } = {};

  JAR_DEFINITIONS.forEach((jar) => {
    allocated[jar.code] = calculateJarAllocation(
      incomeData.amount,
      jar.percentage
    );
  });

  // Save income record
  const incomesRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    INCOMES_COLLECTION
  );

  const docRef = await addDoc(incomesRef, {
    amount: incomeData.amount,
    source: incomeData.source,
    note: incomeData.note || incomeData.description || '',
    category: incomeData.category || incomeData.source,
    allocated,
    createdAt: serverTimestamp(),
  });

  // Allocate to jars (auto-allocate by default, can be disabled)
  if (incomeData.autoAllocate !== false) {
    await allocateIncome(userId, allocated);
  }

  return docRef.id;
}

/**
 * Get a single income
 */
export async function getIncome(
  userId: string,
  incomeId: string
): Promise<Income | null> {
  const incomeRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    INCOMES_COLLECTION,
    incomeId
  );
  const incomeSnap = await getDoc(incomeRef);

  if (!incomeSnap.exists()) {
    return null;
  }

  const data = incomeSnap.data();
  return {
    id: incomeSnap.id,
    amount: data.amount,
    source: data.source,
    note: data.note,
    allocated: data.allocated,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
  };
}

/**
 * Get all incomes for a user
 */
export async function getIncomes(
  userId: string,
  maxResults: number = 50
): Promise<Income[]> {
  const incomesRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    INCOMES_COLLECTION
  );

  const q = query(
    incomesRef,
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      amount: data.amount,
      source: data.source,
      note: data.note,
      allocated: data.allocated,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    };
  });
}

/**
 * Get recent incomes
 */
export async function getRecentIncomes(
  userId: string,
  count: number = 10
): Promise<Income[]> {
  return getIncomes(userId, count);
}

/**
 * Get monthly income total
 * @param userId - User ID
 * @param month - Month (0-11), default current month
 * @param year - Year, default current year
 */
export async function getMonthlyIncome(
  userId: string,
  month?: number,
  year?: number
): Promise<number> {
  const now = new Date();
  const targetMonth = month !== undefined ? month : now.getMonth();
  const targetYear = year !== undefined ? year : now.getFullYear();

  const startOfMonth = new Date(targetYear, targetMonth, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

  const incomesRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    INCOMES_COLLECTION
  );

  const q = query(
    incomesRef,
    where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
    where('createdAt', '<=', Timestamp.fromDate(endOfMonth)),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.reduce((total, doc) => {
    return total + (doc.data().amount || 0);
  }, 0);
}

/**
 * Get yearly income total
 * @param userId - User ID
 * @param year - Year, default current year
 */
export async function getYearlyIncome(
  userId: string,
  year?: number
): Promise<number> {
  const targetYear = year !== undefined ? year : new Date().getFullYear();

  const startOfYear = new Date(targetYear, 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);

  const incomesRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    INCOMES_COLLECTION
  );

  const q = query(
    incomesRef,
    where('createdAt', '>=', Timestamp.fromDate(startOfYear)),
    where('createdAt', '<=', Timestamp.fromDate(endOfYear)),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.reduce((total, doc) => {
    return total + (doc.data().amount || 0);
  }, 0);
}

/**
 * Get total lifetime income
 */
export async function getLifetimeIncome(userId: string): Promise<number> {
  const incomesRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    INCOMES_COLLECTION
  );

  const q = query(incomesRef, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);

  return snapshot.docs.reduce((total, doc) => {
    return total + (doc.data().amount || 0);
  }, 0);
}
