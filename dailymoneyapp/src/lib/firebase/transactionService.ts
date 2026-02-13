import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Transaction } from '@/types';
import { spendFromJar } from './jarService';

const USERS_COLLECTION = 'users';
const TRANSACTIONS_COLLECTION = 'transactions';

/**
 * Create a new transaction
 */
export async function createTransaction(
  userId: string,
  transactionData: Omit<Transaction, 'id' | 'createdAt'>
): Promise<string> {
  const transactionsRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_COLLECTION
  );

  const docRef = await addDoc(transactionsRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
  });

  // Update jar balance if it's an expense
  if (transactionData.type === 'expense') {
    await spendFromJar(userId, transactionData.jarCode, transactionData.amount);
  }

  return docRef.id;
}

/**
 * Get a single transaction
 */
export async function getTransaction(
  userId: string,
  transactionId: string
): Promise<Transaction | null> {
  const transactionRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_COLLECTION,
    transactionId
  );
  const transactionSnap = await getDoc(transactionRef);

  if (!transactionSnap.exists()) {
    return null;
  }

  const data = transactionSnap.data();
  return {
    id: transactionSnap.id,
    amount: data.amount,
    jarCode: data.jarCode,
    category: data.category,
    description: data.description,
    recognizedText: data.recognizedText,
    type: data.type,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
  };
}

/**
 * Get all transactions for a user
 */
export async function getTransactions(
  userId: string,
  maxResults: number = 50
): Promise<Transaction[]> {
  const transactionsRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_COLLECTION
  );

  const q = query(
    transactionsRef,
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      amount: data.amount,
      jarCode: data.jarCode,
      category: data.category,
      description: data.description,
      recognizedText: data.recognizedText,
      type: data.type,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    };
  });
}

/**
 * Get recent transactions
 */
export async function getRecentTransactions(
  userId: string,
  count: number = 10
): Promise<Transaction[]> {
  return getTransactions(userId, count);
}

/**
 * Get transactions for a specific jar
 */
export async function getTransactionsByJar(
  userId: string,
  jarCode: string,
  maxResults: number = 50
): Promise<Transaction[]> {
  const transactionsRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_COLLECTION
  );

  const q = query(
    transactionsRef,
    where('jarCode', '==', jarCode),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      amount: data.amount,
      jarCode: data.jarCode,
      category: data.category,
      description: data.description,
      recognizedText: data.recognizedText,
      type: data.type,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    };
  });
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(
  userId: string,
  transactionId: string
): Promise<void> {
  const transactionRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_COLLECTION,
    transactionId
  );

  await deleteDoc(transactionRef);
}

/**
 * Get monthly spent by jar
 */
export async function getMonthlySpentByJar(
  userId: string,
  jarCode: string
): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const transactionsRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_COLLECTION
  );

  const q = query(
    transactionsRef,
    where('jarCode', '==', jarCode),
    where('type', '==', 'expense'),
    where('createdAt', '>=', Timestamp.fromDate(startOfMonth))
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.reduce((total, doc) => {
    return total + (doc.data().amount || 0);
  }, 0);
}

/**
 * Get total monthly expenses
 * @param userId - User ID
 * @param month - Month (0-11), default current month
 * @param year - Year, default current year
 */
export async function getMonthlyExpenses(
  userId: string,
  month?: number,
  year?: number
): Promise<number> {
  const now = new Date();
  const targetMonth = month !== undefined ? month : now.getMonth();
  const targetYear = year !== undefined ? year : now.getFullYear();

  const startOfMonth = new Date(targetYear, targetMonth, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

  const transactionsRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_COLLECTION
  );

  const q = query(
    transactionsRef,
    where('type', '==', 'expense'),
    where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
    where('createdAt', '<=', Timestamp.fromDate(endOfMonth))
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.reduce((total, doc) => {
    return total + (doc.data().amount || 0);
  }, 0);
}

/**
 * Get total yearly expenses
 * @param userId - User ID
 * @param year - Year, default current year
 */
export async function getYearlyExpenses(
  userId: string,
  year?: number
): Promise<number> {
  const targetYear = year !== undefined ? year : new Date().getFullYear();

  const startOfYear = new Date(targetYear, 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);

  const transactionsRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_COLLECTION
  );

  const q = query(
    transactionsRef,
    where('type', '==', 'expense'),
    where('createdAt', '>=', Timestamp.fromDate(startOfYear)),
    where('createdAt', '<=', Timestamp.fromDate(endOfYear))
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.reduce((total, doc) => {
    return total + (doc.data().amount || 0);
  }, 0);
}

/**
 * Get total lifetime expenses
 */
export async function getLifetimeExpenses(userId: string): Promise<number> {
  const transactionsRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_COLLECTION
  );

  const q = query(
    transactionsRef,
    where('type', '==', 'expense'),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.reduce((total, doc) => {
    return total + (doc.data().amount || 0);
  }, 0);
}
