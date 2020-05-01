import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyDYIdFDQ3ccmgUHsEJC7EQuPGyX3U0BKoM",
    authDomain: "reactemoji.firebaseapp.com",
    databaseURL: "https://reactemoji.firebaseio.com",
    projectId: "reactemoji",
    storageBucket: "reactemoji.appspot.com",
    messagingSenderId: "720480809303",
    appId: "1:720480809303:web:c82a2de9d2d14ab1a9ce12",
    measurementId: "G-C64FSH40V9"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.database();
export const firestore = firebase.firestore();
export const key = "Liars_Dice";
export default firestore;
