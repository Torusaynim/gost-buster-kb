import './../App.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { GoogleLogin } from '@react-oauth/google';


function Welcome(props) {

    const backUri = 'http://127.0.0.1:5000';

    const [loginData, setLoginData] = useState(
        localStorage.getItem('loginData')
            ? JSON.parse(localStorage.getItem('loginData'))
            : null
    );

    const [NotesList, toggleNotes] = useState(
        false
    )

    let navigate = useNavigate();

    const handleLogin = async (googleData) => {
        console.log(googleData);

        const res = await fetch(backUri+'/api/google-login', {
            method: 'POST',
            body: JSON.stringify({
                token: googleData.credential,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        const data = await res.json();
        setLoginData(data);
        toggleNotes(false);
        localStorage.setItem('loginData', JSON.stringify(data));

        let path = `home`; 
        navigate(path);
    };

    return (
        <div className="App">
            <div>
                <h1>База Знаний в области ГОСТ на разработку в области Информационных Технологий</h1>
                <Button variant="contained" onClick={props.toggleTheme}>Toggle Theme</Button>
                <div><GoogleLogin
                    onSuccess={handleLogin}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                /></div>
            </div>
        </div>
    );

}

export default Welcome;