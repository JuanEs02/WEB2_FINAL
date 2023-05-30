import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCV5MnjenIY2MT16FurUi-nvL9UdODQWoM",
  authDomain: "crud-final-64793.firebaseapp.com",
  projectId: "crud-final-64793",
  storageBucket: "crud-final-64793.appspot.com",
  messagingSenderId: "815716544511",
  appId: "1:815716544511:web:82cdd9ce8d62b2be7341ca"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {db}