import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const getUserSubscriptions = async (userId: string): Promise<string[]> => {
  try {
    const docRef = doc(db, 'subscriptions', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().tickers || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
};

export const addSubscription = async (userId: string, ticker: string): Promise<void> => {
  try {
    const docRef = doc(db, 'subscriptions', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        tickers: arrayUnion(ticker)
      });
    } else {
      await setDoc(docRef, {
        userId,
        tickers: [ticker]
      });
    }
  } catch (error) {
    console.error('Error adding subscription:', error);
    throw error;
  }
};

export const removeSubscription = async (userId: string, ticker: string): Promise<void> => {
  try {
    const docRef = doc(db, 'subscriptions', userId);
    await updateDoc(docRef, {
      tickers: arrayRemove(ticker)
    });
  } catch (error) {
    console.error('Error removing subscription:', error);
    throw error;
  }
};
