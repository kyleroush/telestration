import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyDYIdFDQ3ccmgUHsEJC7EQuPGyX3U0BKoM",
    authDomain: "reactemoji.firebaseapp.com",
    databaseURL: "https://reactemoji.firebaseio.com",
    projectId: "reactemoji",
    storageBucket: "reactemoji.appspot.com",
    messagingSenderId: "720480809303",
    appId: "1:720480809303:web:39b5d0faef073010a9ce12",
    measurementId: "G-46CVFFLWX6"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.database();
export const firestore = firebase.firestore();
export const key = "Telestration";
export default firestore;
