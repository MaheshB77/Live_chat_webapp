import React from "react";
import "./App.css";
import { motion } from "framer-motion";

function App() {
    return (
        <div className="App">
            <motion.h1
                animate={{
                    color: "black",
                    scale: 0.9,
                    transition: {
                        yoyo: 6
                    }
                }}>
                Liviano live chat coming soon......
            </motion.h1>
        </div>
    );
}

export default App;
