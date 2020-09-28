import React from "react";
import "./App.css";
import { motion } from "framer-motion";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

/**
 * Initializing the firebase app
 */
firebase.initializeApp({
    apiKey: "AIzaSyDmhtZbpO3_4qxp4Z6opVZMt1clPjQYs6w",
    authDomain: "liviano-live-chat.firebaseapp.com",
    databaseURL: "https://liviano-live-chat.firebaseio.com",
    projectId: "liviano-live-chat",
    storageBucket: "liviano-live-chat.appspot.com",
    messagingSenderId: "563262955647",
    appId: "1:563262955647:web:a593b57fa2f035bd5d1f4a",
    measurementId: "G-K6E916F2CZ"
});

const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {
    const [user] = useAuthState(auth);
    let isLoggedIn = user ? <Welcome /> : <PleaseLogin />;
    return (
        <div className="App">
            <motion.h1
                className="MaintenanceText"
                animate={{
                    scale: 0.9,
                    transition: {
                        yoyo: 6
                    }
                }}>
                Under Maintenance
            </motion.h1>
            <div className="MainApp">{isLoggedIn}</div>
        </div>
    );
}

const Welcome = () => {
    return (
        <div>
            <h1>Welcome!!!</h1>
            <SignOut />
        </div>
    );
};
function PleaseLogin() {
    const googleAuth = (event) => {
        event.preventDefault();
        const authProvider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(authProvider);
    };
    return (
        <div className="PleaseLogin">
            <button className="SigninButton" onClick={googleAuth}>
                Click to sign with google
            </button>
        </div>
    );
}
function SignOut() {
    return (
        <button className="SignoutButton" onClick={() => auth.signOut()}>
            Sign Out
        </button>
    );
}

export default App;
