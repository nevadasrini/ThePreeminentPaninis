const firebaseConfig = {
    apiKey: "AIzaSyBm-4tu-ZW5kdpLkUw6OLxFjB_ajLJFEnY",
    authDomain: "preeminent-paninis.firebaseapp.com",
    databaseURL: "https://preeminent-paninis.firebaseio.com",
    projectId: "preeminent-paninis",
    storageBucket: "preeminent-paninis.appspot.com",
    messagingSenderId: "1025410002463",
    appId: "1:1025410002463:web:40cec81a8b2a7c8f7caf2a",
    measurementId: "G-Y35S3D1RJ4"
  };
alert("yuh");
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
analytics = firebase.analytics();
firestore = firebase.firestore();

alert("na");
/**
 * @param {string} userToken - identifier of user info wanted
 */

function getUserInfo(){
    alert("hi");
    let name = firestore.collection("users").where("name", "==", "John Steinbeck").get("field");
    alert("nah");
    alert(name);
}