import './App.css';
import React from 'react';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Home from './components/Home';
import About from './components/About';
import Contacts from './components/Contacts';
import Note from './components/Note';
import {Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';


function App(props) {

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Navbar toggleTheme={props.toggleTheme} />
            <Routes>
                <Route exact path="/" element={<Welcome />} />
                <Route exact path="/home" element={<Home />} />
                <Route exact path="/about" element={<About />} />
                <Route exact path="/contacts" element={<Contacts />} />
                <Route path="/note/:id" element={<Note />} />
            </Routes>
        </GoogleOAuthProvider>
    );

}

export default App;
