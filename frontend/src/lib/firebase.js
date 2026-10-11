import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // paste the same values as your Resources site
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
