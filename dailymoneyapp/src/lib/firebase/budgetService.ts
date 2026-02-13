import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Budget } from '@/types';

const USERS_COLLECTION = 'users';
const BUDGETS_COLLECTION = 'budgets';

/**
 * Create a new budget
 */
export async function createBudget(
  userId: string,
  budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const budgetsRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    BUDGETS_COLLECTION
  );

  const docRef = await addDoc(budgetsRef, {
    ...budgetData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Get budget by ID
 */
export async function getBudget(
  userId: string,
  budgetId: string
): Promise<Budget | null> {
  const budgetRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    BUDGETS_COLLECTION,
    budgetId
  );
  const budgetSnap = await getDoc(budgetRef);

  if (!budgetSnap.exists()) {
    return null;
  }

  const data = budgetSnap.data();
  return {
    id: budgetSnap.id,
    jarCode: data.jarCode,
    category: data.category,
    amount: data.amount,
    period: data.period,
    startDate: (data.startDate as Timestamp)?.toDate() || new Date(),
    endDate: data.endDate ? (data.endDate as Timestamp).toDate() : undefined,
    alertThreshold: data.alertThreshold,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}

/**
 * Get all budgets for a user
 */
export async function getBudgets(userId: string): Promise<Budget[]> {
  const budgetsRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    BUDGETS_COLLECTION
  );

  const q = query(budgetsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      jarCode: data.jarCode,
      category: data.category,
      amount: data.amount,
      period: data.period,
      startDate: (data.startDate as Timestamp)?.toDate() || new Date(),
      endDate: data.endDate ? (data.endDate as Timestamp).toDate() : undefined,
      alertThreshold: data.alertThreshold,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });
}

/**
 * Get active budgets for current period
 */
export async function getActiveBudgets(userId: string): Promise<Budget[]> {
  const now = new Date();
  const budgetsRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    BUDGETS_COLLECTION
  );

  const q = query(
    budgetsRef,
    where('startDate', '<=', Timestamp.fromDate(now)),
    orderBy('startDate', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        jarCode: data.jarCode,
        category: data.category,
        amount: data.amount,
        period: data.period,
        startDate: (data.startDate as Timestamp)?.toDate() || new Date(),
        endDate: data.endDate
          ? (data.endDate as Timestamp).toDate()
          : undefined,
        alertThreshold: data.alertThreshold,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
      };
    })
    .filter((budget) => !budget.endDate || budget.endDate > now);
}

/**
 * Update budget
 */
export async function updateBudget(
  userId: string,
  budgetId: string,
  updates: Partial<Budget>
): Promise<void> {
  const budgetRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    BUDGETS_COLLECTION,
    budgetId
  );

  await updateDoc(budgetRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete budget
 */
export async function deleteBudget(
  userId: string,
  budgetId: string
): Promise<void> {
  const budgetRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    BUDGETS_COLLECTION,
    budgetId
  );

  await deleteDoc(budgetRef);
}

/**
 * Check if spending exceeds budget threshold
 */
export async function checkBudgetAlerts(
  userId: string,
  jarCode: string,
  spent: number
): Promise<{ exceeded: boolean; budget: Budget | null; percentage: number }> {
  const budgets = await getActiveBudgets(userId);
  const jarBudget = budgets.find((b) => b.jarCode === jarCode);

  if (!jarBudget) {
    return { exceeded: false, budget: null, percentage: 0 };
  }

  const percentage = (spent / jarBudget.amount) * 100;
  const threshold = jarBudget.alertThreshold || 80;
  const exceeded = percentage >= threshold;

  return {
    exceeded,
    budget: jarBudget,
    percentage,
  };
}
