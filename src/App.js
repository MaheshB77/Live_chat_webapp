import React, { useRef, useState } from "react";
import "./App.css";
import { motion } from "framer-motion";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

// Initializing the app using Firebase
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
    let loadUser = user ? <Chat /> : <PleaseLogin />;
    let signOut = user ? <SignOut /> : null;
    return (
        <div className="App">
            <div className="AppHeading">This app is under development</div>
            <div className="MainApp">{loadUser}</div>
            <div className="Signout">{signOut}</div>
        </div>
    );
}

// Temporary Welcome message
// const Welcome = () => {
//     return (
//         <div>
//             <h1>Welcome{" " + auth.currentUser.displayName + " !"}</h1>
//             <SignOut />
//         </div>
//     );
// };

// Actual Chat Room
const Chat = () => {
    /**
     * Creating a query and retrieving the realtime data using
     * useCollectionData() hook
     */
    const messages = firestore.collection("messages");
    const query = messages.orderBy("messageCreationTime");
    const [latestMessages] = useCollectionData(query, { idField: "id" });

    const [currentMessage, setCurrentMessage] = useState("");
    const utilityObject = useRef();

    /**
     * Sending a message
     */
    const sendMessage = async (event) => {
        event.preventDefault();
        const { uid, photoURL } = auth.currentUser;

        await messages.add({
            messageText: currentMessage,
            messageCreationTime: firebase.firestore.FieldValue.serverTimestamp(),
            uid: uid,
            photoURL: photoURL
        });

        setCurrentMessage("");
        utilityObject.current.scrollIntoView({ behavior: "smooth" });
    };
    let allMessages = latestMessages
        ? latestMessages.map((message) => {
              console.log(message);
              return <Message key={message.id} message={message} />;
          })
        : null;

    const handleChange = (event) => {
        setCurrentMessage(event.target.value);
    };
    return (
        <div className="Chat">
            <div className="Chat-messages">
                {allMessages}
                <span ref={utilityObject}></span>
            </div>

            <form onSubmit={sendMessage} className="Message-form">
                <input
                    type="text"
                    placeholder="Start typing"
                    value={currentMessage}
                    onChange={handleChange}
                />
                <button type="submit" disabled={!currentMessage}>
                    Send
                </button>
            </form>
        </div>
    );
};

// Message component
const Message = (props) => {
    const { messageText, uid, photoURL } = props.message;
    const userTypeClass = uid === auth.currentUser.uid ? "sent" : "received";

    return (
        <div className={`${userTypeClass} Message`}>
            <img src={photoURL} alt="userPic" />
            <p>{messageText}</p>
        </div>
    );
};

// Login
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

// Logout
function SignOut() {
    return (
        <button className="SignoutButton" onClick={() => auth.signOut()}>
            Sign Out
        </button>
    );
}

export default App;
