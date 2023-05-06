import './index.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, lightBlue, red, green, amber, deepOrange, grey } from '@mui/material/colors';


const getDesignTokens = (mode) => ({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            primary: blue,
            divider: grey[50],
            background: {
                default: grey[50],
                paper: grey[300],
            },
            text: {
              primary: grey[900],
              secondary: grey[800],
            },
          }
        : {
            // palette values for dark mode
            primary: red,
            divider: '#282c34',
            background: {
              default: '#282c34',
              paper: grey[700],
            },
            text: {
              primary: '#fff',
              secondary: grey[500],
            },
          }),
    },
});

const AppWrapper = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        // Get the current theme value from localStorage (if it exists)
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
          setIsDarkMode(storedTheme === 'dark');
        }
        setIsLoading(false);
    }, []);

    const lightTheme = createTheme(getDesignTokens('light'));
    const darkTheme = createTheme(getDesignTokens('dark'));
    
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };
    
    useEffect(() => {
        // Save the current theme value to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    if (isLoading) {
        return null;
    }

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App toggleTheme={toggleTheme} />
      </BrowserRouter>
    </ThemeProvider>
    );
};

ReactDOM.render(<AppWrapper/>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
