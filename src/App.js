import './App.css';
import React from 'react';
import Welcome from './components/Welcome';
import Home from './components/Home';
import {Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';


function App(props) {

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Routes>
                {/* <Route exact path="/path" element={<ComponentName/>} /> */}
                <Route exact path="/" element={<Welcome toggleTheme={props.toggleTheme} />} />
                <Route exact path="/home" element={<Home toggleTheme={props.toggleTheme} />} />
                <Route exact path="/about" element={<Home toggleTheme={props.toggleTheme} />} />
                <Route exact path="/contacts" element={<Home toggleTheme={props.toggleTheme} />} />
                <Route exact path="/note" element={<Home toggleTheme={props.toggleTheme} />} />
            </Routes>
        </GoogleOAuthProvider>
    );

}

export default App;
