import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

export const checkIsAdmin = async () => {
  const user = auth.currentUser;

  if (!user) {
    return false;
  }

  const adminRef = doc(db, "admins", user.uid);
  const adminSnap = await getDoc(adminRef);

  if (!adminSnap.exists()) {
    return false;
  }

  const data = adminSnap.data();

  return data.role === "admin";
};