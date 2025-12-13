// firebase-config.js
alert("firebase-config.js loaded"); // remove later

const firebaseConfig = {
  apiKey: "AIzaSyBK_o7S1Bcp5u4hKA3j-V_xodrD6PxtNCQ",
  authDomain: "ai-credit-repair-992c7.firebaseapp.com",
  projectId: "ai-credit-repair-992c7",
  storageBucket: "ai-credit-repair-992c7.appspot.com",
  messagingSenderId: "411411517046",
  appId: "1:411411517046:web:fa2013a0f914aa06fc5957"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
