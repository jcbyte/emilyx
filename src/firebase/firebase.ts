// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBErZUONAdttTYpLD-mq8z2DQZtUWnBXQ4",
	authDomain: "emilyx-420xd.firebaseapp.com",
	projectId: "emilyx-420xd",
	storageBucket: "emilyx-420xd.firebasestorage.app",
	messagingSenderId: "273862407746",
	appId: "1:273862407746:web:470f697488a2c4c5fb9fdb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
