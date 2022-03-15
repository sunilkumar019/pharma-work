import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "xxxxxxxxxxx.firebaseapp.com",
    projectId: "xxxxxxxxxxxx",
    storageBucket: "xxxxxxxxxxxx.appspot.com",
    messagingSenderId: "xxxxxxxxxxxxx",
    appId: "1:xxxxxxxxxxxxx:web:xxxxxxxxxxxxxxx",
    measurementId: "x-xxxxxxxxxxxxxxxxxxxxx"
  };

const Firebase = firebase.initializeApp(firebaseConfig)
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();    
export default Firebase