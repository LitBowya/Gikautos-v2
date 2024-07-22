import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  onChildAdded,
  onChildRemoved,
  off,
  child,
  onValue,
  remove,
  onDisconnect,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDncOIeeG1ydAhYIxW8dighmvqHiJz4BEs",
  authDomain: "gikautos.firebaseapp.com",
  projectId: "gikautos",
  storageBucket: "gikautos.appspot.com",
  messagingSenderId: "567102683196",
  appId: "1:567102683196:web:38b288c9fde8b908246b39",
  measurementId: "G-B7WV3CPJL4",
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);
const storage = getStorage(firebase)

export {
  database,
  ref,
  push,
  set,
  update,
  onChildAdded,
  off,
  child,
  onValue,
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL,
  remove,
  onDisconnect,
  onChildRemoved,
};
export default firebase;
