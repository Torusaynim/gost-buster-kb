import './App.css';
import React from 'react';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Home from './components/Home';
import {Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';


function App(props) {

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Navbar toggleTheme={props.toggleTheme} />
            <Routes>
                <Route exact path="/" element={<Welcome />} />
                <Route exact path="/home" element={<Home />} />
                <Route exact path="/about" element={<Home />} />
                <Route exact path="/contacts" element={<Home />} />
                <Route exact path="/note" element={<Home />} />
            </Routes>
        </GoogleOAuthProvider>
    );

}

export default App;
