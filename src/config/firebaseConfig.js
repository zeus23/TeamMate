import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyAUDwMoMAmxp29kLYcF-GZlEhvFOWDyRa4",
    authDomain: "teammate-f7ece.firebaseapp.com",
    projectId: "teammate-f7ece",
    storageBucket: "teammate-f7ece.appspot.com",
    messagingSenderId: "1078459971085",
    appId: "1:1078459971085:web:537dcf77fece82fc9a8744"
};

firebase.initializeApp(firebaseConfig);

export default firebase;