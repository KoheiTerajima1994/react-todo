import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// .env ファイルから環境変数を取得
const apiKey = import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGE_SENDER_ID;
const appId = import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID;

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };