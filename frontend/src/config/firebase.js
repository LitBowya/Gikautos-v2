
import firebase from 'firebase'
import 'firebase/storage'
import 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "gikautos.firebaseapp.com",
  projectId: "gikautos",
  storageBucket: "gikautos.appspot.com",
  messagingSenderId: "567102683196",
  appId: "1:567102683196:web:38b288c9fde8b908246b39",
  measurementId: "G-B7WV3CPJL4"
};

firebase.initializeApp(firebaseConfig)
firebase.analytics()

export default firebase