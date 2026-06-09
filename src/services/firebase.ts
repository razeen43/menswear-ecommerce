import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtW73WlWV7VI11fOn3YT4XNaoclpNvZSU",
  authDomain: "menswear-ecommerce.firebaseapp.com",
  projectId: "menswear-ecommerce",
  storageBucket: "menswear-ecommerce.firebasestorage.app",
  messagingSenderId: "773285826127",
  appId: "1:773285826127:web:be3a892a0ffec5e7a4243a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);