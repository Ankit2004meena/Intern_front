
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGZ38MfUZy0GEbq4yvi0oBz9S_9tbW3AI",
  authDomain: "intern-area-1da81.firebaseapp.com",
  projectId: "intern-area-1da81",
  storageBucket: "intern-area-1da81.appspot.com",
  messagingSenderId: "40703447414",
  appId: "1:40703447414:web:9953bd5787cae5ac46ea57",
  measurementId: "G-VSX68F7NVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
const firestore = getFirestore(app);
export { auth, provider,firestore};

