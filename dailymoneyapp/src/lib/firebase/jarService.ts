import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { JarData, AllJarsData } from '@/types';
import { JAR_DEFINITIONS } from '@/lib/constants/jars';

const USERS_COLLECTION = 'users';
const JARS_COLLECTION = 'jars';

/**
 * Initialize jars for a new user
 */
export async function initializeJars(userId: string): Promise<void> {
  const batch = writeBatch(db);

  JAR_DEFINITIONS.forEach((jarDef) => {
    const jarRef = doc(db, USERS_COLLECTION, userId, JARS_COLLECTION, jarDef.code);
    batch.set(jarRef, {
      code: jarDef.code,
      allocated: 0,
      balance: 0,
      spent: 0,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

/**
 * Get all jars for a user
 */
export async function getAllJars(userId: string): Promise<AllJarsData> {
  const jarsRef = collection(db, USERS_COLLECTION, userId, JARS_COLLECTION);
  const snapshot = await getDocs(jarsRef);

  if (snapshot.empty) {
    // Initialize jars if they don't exist
    await initializeJars(userId);
    return getAllJars(userId); // Recursive call to get initialized jars
  }

  const jars: AllJarsData = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    jars[doc.id] = {
      code: data.code,
      allocated: data.allocated || 0,
      balance: data.balance || 0,
      spent: data.spent || 0,
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });

  return jars;
}

/**
 * Get a specific jar
 */
export async function getJar(
  userId: string,
  jarCode: string
): Promise<JarData | null> {
  const jarRef = doc(db, USERS_COLLECTION, userId, JARS_COLLECTION, jarCode);
  const jarSnap = await getDoc(jarRef);

  if (!jarSnap.exists()) {
    return null;
  }

  const data = jarSnap.data();
  return {
    code: data.code,
    allocated: data.allocated || 0,
    balance: data.balance || 0,
    spent: data.spent || 0,
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}

/**
 * Allocate income to jars
 */
export async function allocateIncome(
  userId: string,
  allocations: { [jarCode: string]: number }
): Promise<void> {
  const batch = writeBatch(db);

  Object.entries(allocations).forEach(([jarCode, amount]) => {
    const jarRef = doc(db, USERS_COLLECTION, userId, JARS_COLLECTION, jarCode);
    batch.update(jarRef, {
      allocated: increment(amount),
      balance: increment(amount),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

/**
 * Spend from a jar
 */
export async function spendFromJar(
  userId: string,
  jarCode: string,
  amount: number
): Promise<void> {
  const jarRef = doc(db, USERS_COLLECTION, userId, JARS_COLLECTION, jarCode);

  await updateDoc(jarRef, {
    balance: increment(-amount),
    spent: increment(amount),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Transfer between jars
 */
export async function transferBetweenJars(
  userId: string,
  fromJar: string,
  toJar: string,
  amount: number
): Promise<void> {
  const batch = writeBatch(db);

  // Subtract from source jar
  const fromJarRef = doc(db, USERS_COLLECTION, userId, JARS_COLLECTION, fromJar);
  batch.update(fromJarRef, {
    balance: increment(-amount),
    updatedAt: serverTimestamp(),
  });

  // Add to destination jar
  const toJarRef = doc(db, USERS_COLLECTION, userId, JARS_COLLECTION, toJar);
  batch.update(toJarRef, {
    balance: increment(amount),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

/**
 * Reset monthly jars (keep allocated, reset spent and balance to allocated)
 */
export async function resetMonthlyJars(userId: string): Promise<void> {
  const jars = await getAllJars(userId);
  const batch = writeBatch(db);

  Object.entries(jars).forEach(([jarCode, jarData]) => {
    const jarRef = doc(db, USERS_COLLECTION, userId, JARS_COLLECTION, jarCode);
    batch.update(jarRef, {
      balance: jarData.allocated,
      spent: 0,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}
