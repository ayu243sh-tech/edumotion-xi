import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlQvMuG3y0OaezDNubul_1nZ1HqmgdToE",
  authDomain: "edumotion-xi-d1728.firebaseapp.com",
  projectId: "edumotion-xi-d1728",
  storageBucket: "edumotion-xi-d1728.firebasestorage.app",
  messagingSenderId: "1092578556361",
  appId: "1:1092578556361:web:01ac74495513af30001018",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
