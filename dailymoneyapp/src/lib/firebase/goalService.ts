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
import { FinancialGoal } from '@/types';

const USERS_COLLECTION = 'users';
const GOALS_COLLECTION = 'goals';

/**
 * Create a new financial goal
 */
export async function createGoal(
  userId: string,
  goalData: Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const goalsRef = collection(db, USERS_COLLECTION, userId, GOALS_COLLECTION);

  const docRef = await addDoc(goalsRef, {
    ...goalData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Get goal by ID
 */
export async function getGoal(
  userId: string,
  goalId: string
): Promise<FinancialGoal | null> {
  const goalRef = doc(db, USERS_COLLECTION, userId, GOALS_COLLECTION, goalId);
  const goalSnap = await getDoc(goalRef);

  if (!goalSnap.exists()) {
    return null;
  }

  const data = goalSnap.data();
  return {
    id: goalSnap.id,
    title: data.title,
    description: data.description,
    targetAmount: data.targetAmount,
    currentAmount: data.currentAmount,
    targetDate: data.targetDate
      ? (data.targetDate as Timestamp).toDate()
      : undefined,
    jarCode: data.jarCode,
    status: data.status,
    priority: data.priority,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}

/**
 * Get all goals for a user
 */
export async function getGoals(userId: string): Promise<FinancialGoal[]> {
  const goalsRef = collection(db, USERS_COLLECTION, userId, GOALS_COLLECTION);

  const q = query(goalsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      targetDate: data.targetDate
        ? (data.targetDate as Timestamp).toDate()
        : undefined,
      jarCode: data.jarCode,
      status: data.status,
      priority: data.priority,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });
}

/**
 * Get active goals
 */
export async function getActiveGoals(userId: string): Promise<FinancialGoal[]> {
  const goalsRef = collection(db, USERS_COLLECTION, userId, GOALS_COLLECTION);

  const q = query(
    goalsRef,
    where('status', '==', 'active'),
    orderBy('priority', 'desc'),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      targetDate: data.targetDate
        ? (data.targetDate as Timestamp).toDate()
        : undefined,
      jarCode: data.jarCode,
      status: data.status,
      priority: data.priority,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });
}

/**
 * Update goal
 */
export async function updateGoal(
  userId: string,
  goalId: string,
  updates: Partial<FinancialGoal>
): Promise<void> {
  const goalRef = doc(db, USERS_COLLECTION, userId, GOALS_COLLECTION, goalId);

  await updateDoc(goalRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update goal progress
 */
export async function updateGoalProgress(
  userId: string,
  goalId: string,
  amount: number
): Promise<void> {
  const goal = await getGoal(userId, goalId);
  
  if (!goal) {
    throw new Error('Goal not found');
  }

  const newAmount = goal.currentAmount + amount;
  const updates: Partial<FinancialGoal> = {
    currentAmount: newAmount,
  };

  // Auto-complete if target reached
  if (newAmount >= goal.targetAmount && goal.status === 'active') {
    updates.status = 'completed';
  }

  await updateGoal(userId, goalId, updates);
}

/**
 * Delete goal
 */
export async function deleteGoal(
  userId: string,
  goalId: string
): Promise<void> {
  const goalRef = doc(db, USERS_COLLECTION, userId, GOALS_COLLECTION, goalId);

  await deleteDoc(goalRef);
}

/**
 * Get goal completion percentage
 */
export function getGoalProgress(goal: FinancialGoal): number {
  if (goal.targetAmount === 0) return 0;
  return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
}

/**
 * Get days remaining until target date
 */
export function getDaysRemaining(goal: FinancialGoal): number | null {
  if (!goal.targetDate) return null;

  const now = new Date();
  const diff = goal.targetDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
