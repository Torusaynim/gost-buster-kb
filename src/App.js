import './App.css';
import Input from './UI/Input'
import Button from '@mui/material/Button';
import Table from './UI/Table';
import React, { useState } from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';


function App(props) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openSupport, setOpenSupport] = useState(false);
    const [noteId, setNoteId] = useState(null);
    const [text, setText] = useState('Sample name');
    const [sumGET, setSum] = useState(0);

    const [access, setAccess] = useState(false);

    const backUri = 'http://127.0.0.1:5000';

    const handleEditNote = async (noteId) => {
        console.log('handleEditNote')
        if (noteId) {
            setOpenEdit(true);
            setNoteId(noteId);
        }
    };

    const handleSupportNote = async (noteId) => {
        console.log('handleSupportNote')
        console.log(access)
        if (noteId) {
            setOpenSupport(true);
            setNoteId(noteId);
        }
    };

    const handleCloseEdit = () => {
        console.log('handleCloseEdit')
        setOpenEdit(false);
    }

    const handleCloseSupport = () => {
        console.log('handleCloseSupport')
        setOpenSupport(false);
    }

    const [loginData, setLoginData] = useState(
        localStorage.getItem('loginData')
            ? JSON.parse(localStorage.getItem('loginData'))
            : null
    );

    const [NotesList, toggleNotes] = useState(
        false
    )

    // const handleFailure = (result) => {
    //     console.log(window.location.href);
    //     console.log(result);
    // };

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
    };
    const handleLogout = () => {
        localStorage.removeItem('loginData');
        setLoginData(null);
        toggleNotes(false);
    };

    const handleGetAllNotes = async () => {
        // if (!NotesList) {
        const res = await fetch(backUri+'/api/get-all-Notes')
        const result = await res.json().then(data => { return data })
        toggleNotes(result)
        // } else {
        // toggleNotes(false)
        // }
    }

    const handleGetUserNotes = async () => {
        // if (!NotesList) {
        const res = await fetch(backUri+'/api/get-user-Notes/' + loginData.googleId)
        const result = await res.json().then(data => { return data })
        toggleNotes(result)
        // } else {
        // toggleNotes(false)
        // }
    }

    const handleNewNote = async (name,sum) => {
        console.log('handleNewNote')
    
        console.log(sum);
        await fetch(backUri+'/api/new-Note', {
            method: 'POST',
            body: JSON.stringify({
                user: loginData.googleId,
                name: name,
                sum: sum,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        await handleGetUserNotes(loginData.googleId);
    };
  

    const handleDelete = async (noteId) => {
        console.log('handleDelete')
        await fetch(backUri+'/api/delete-Note', {
            method: 'POST',
            body: JSON.stringify({
                _id: noteId
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        await handleGetUserNotes(loginData.googleId)
    };

    const handleEdit = async () => {
     
        await fetch(backUri+'/api/edit-Note', {
            method: 'POST',
            body: JSON.stringify({
                _id: noteId,
                name: text,
                sum: sumGET
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        setOpenEdit(false)
        await handleGetUserNotes(loginData.googleId)
    };

    const handleSupport = async () => {
     
        await fetch(backUri+'/api/support-Note', {
            method: 'POST',
            body: JSON.stringify({
                _id: noteId,
                sum: sumGET
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        setOpenSupport(false)
        await handleGetUserNotes(loginData.googleId)
    };

    const handleChangeText = (e) => {

        setText(e.target.value)
    };
    const handleChangeSum = (e) => {
        setSum(e.target.value)
    };

    // const getUser = async (userId) => {
    //     const user_res = await fetch(backUri+'/api/get-user/' + userId)
    //     const result = await user_res.json().then(data => {return data})
    //     console.log(result)
    //     return result
    // }
    //
    // const getPermissions = async (role) => {
    //     const res = await fetch(backUri+'/api/get-permissions/'+role)
    //     const result = await res.json().then(data => {return data})
    //     console.log(result)
    //     return result
    // }

    const hasUserAccess = async (perm) => {
        const res = await fetch(backUri+'/api/get-user-permissions/' + loginData.googleId)
        const result = await res.json()
        setPermission(result.permissions.some(e => e === perm))
    }

    const setPermission = (permission) => {
        setAccess(permission)
    }

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <div className="App">
                <div>
                    {loginData ? (
                        <div>
                            <h1>Browse Notes</h1>
                            <Button variant="outlined" onClick={props.toggleTheme}>Toggle Theme</Button>
                            <h3>You've logged in as {loginData.email} (googleId - {loginData.googleId})</h3>
                            <Dialog open={openEdit} onClose={handleCloseEdit}>
                                <DialogTitle>Edit Note</DialogTitle>
                            
                                <DialogContent>
                                    <form>

                                    <TextField
                                        onChange={handleChangeText}
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Enter new name"
                                        type="name"
                                        fullWidth
                                        variant="standard"
                                    />
                                    <TextField
                                        onChange={handleChangeSum}
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Enter new sum"
                                        type="number"
                                        fullWidth
                                        variant="standard"
                                        />
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseEdit}>Cancel</Button>
                                    <Button onClick={handleEdit}>Edit</Button>
                                </DialogActions>
                            </Dialog>

                            <Dialog open={openSupport} onClose={handleCloseSupport}>
                                <DialogTitle>Support Note</DialogTitle>
                            
                                <DialogContent>
                                    <form>

                                    <TextField
                                        onChange={handleChangeSum}
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Enter amount of support"
                                        type="number"
                                        fullWidth
                                        variant="standard"
                                        />
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseSupport}>Cancel</Button>
                                    <Button onClick={handleSupport}>Support</Button>
                                </DialogActions>
                            </Dialog>
                            <Input onNewNote={handleNewNote} />
                            <Button variant="outlined" onClick={handleGetAllNotes}>Browse All Notes</Button>
                            {/* {hasUserAccess('view_all') &&
                                <Button disabled={!access} variant="outlined" onClick={handleGetAllNotes}>Get all notes</Button>
                            } */}
                            <Button variant="outlined" onClick={handleGetUserNotes}>My Notes</Button>
                            {NotesList ? (
                                <div>
                                {hasUserAccess('view_all') &&
                                    <Table data={NotesList} currentUser={loginData.googleId} access={access} onNoteSupport={handleSupportNote} onNoteEdit={handleEditNote} onNoteDelete={handleDelete} />
                                }
                                </div>
                            ) : (
                                <div></div>
                            )}
                            <br /><br /><br />
                            <button onClick={handleLogout} className="ggl-btn">
                                <span style={{ fontWeight: 500, padding: "10px" }}>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h1>Login Page</h1>
                                <GoogleLogin
                                    onSuccess={handleLogin}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />
                                {/* <GoogleLogin
                                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                    buttonText="Log in with Google"
                                    onSuccess={handleLogin}
                                    onFailure={handleFailure}
                                    cookiePolicy={'single_host_origin'}
                                /> */}
                        </div>
                    )}
                </div>
            </div>
        </GoogleOAuthProvider>
    );

}

export default App;