import './../App.css';
import Input from './Input'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Table from './Table';
import React, { useState } from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import { GoogleLogin } from '@react-oauth/google';


function Home(props) {
    const theme = useTheme();
    
    const backUri = 'http://127.0.0.1:5000';
    
    const [openEdit, setOpenEdit] = useState(false);
    const [noteId, setNoteId] = useState(null);
    const [text, setText] = useState('Sample name');
    const [sumGET, setSum] = useState(0);

    const [access, setAccess] = useState(false);

    const handleEditNote = async (noteId) => {
        console.log('handleEditNote')
        if (noteId) {
            setOpenEdit(true);
            setNoteId(noteId);
        }
    };

    const handleCloseEdit = () => {
        console.log('handleCloseEdit')
        setOpenEdit(false);
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

    const handleNewNote = async (name, group, number, status, tags, links, note) => {
        console.log('handleNewNote')

        await fetch(backUri+'/api/new-Note', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                group: group,
                number: number,
                status: status,
                tagsArray: tags.split(/[ ,]+/),
                note: note,
                linksArray: links.split(/[ ,]+/)
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        await handleGetAllNotes();
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

    const handleChangeText = (e) => {

        setText(e.target.value)
    };
    const handleChangeSum = (e) => {
        setSum(e.target.value)
    };

    const hasUserAccess = async (perm) => {
        const res = await fetch(backUri+'/api/get-user-permissions/' + loginData.googleId)
        const result = await res.json()
        setPermission(result.permissions.some(e => e === perm))
    }

    const setPermission = (permission) => {
        setAccess(permission)
    }

    return (
        <div className="App" style={{ marginTop: '60px' }}>
          <Container maxWidth="sm">
            <Box sx={{ p: 2 }}>
                {loginData ? (
                    <div>
                        <h1>Просмотр записей</h1>
                        <h3>Пользователь авторизован (googleId - {loginData.googleId})</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Avatar
                                sx={{ bgcolor: theme.palette.background.paper }}
                                alt={loginData.name}
                                // src="/broken-image.jpg"
                            />
                            <span style={{ marginLeft: '0.5em' }}>{loginData.email}</span>
                        </div>
                        <Dialog open={openEdit} onClose={handleCloseEdit}>
                            <DialogTitle>Изменить</DialogTitle>
                        
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
                                <Button onClick={handleCloseEdit}>Отмена</Button>
                                <Button onClick={handleEdit}>Изменить</Button>
                            </DialogActions>
                        </Dialog>

                        {hasUserAccess('modify') &&
                            access ? (
                                <Input onNewNote={handleNewNote} />
                            ) : (
                                <>

                                </>
                            )
                        }

                        {/* <p>User Access: {hasUserAccess('modify').toString()}</p> */}
                        
                        <Box sx={{ p: 2 }}>
                            <Button variant="contained" onClick={handleGetAllNotes}>Все записи</Button>
                        </Box>
                        
                        
                        {NotesList ? (
                            <div>
                            {hasUserAccess('modify') &&
                                <Table data={NotesList} currentUser={loginData.googleId} access={access} onNoteEdit={handleEditNote} onNoteDelete={handleDelete} />
                            }
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <br /><br /><br />
                        <Button variant="contained" onClick={handleLogout}>Выйти</Button>
                    </div>
                ) : (
                    <div>
                        <h1>Для работы с системой необходима авторизация</h1>
                            <GoogleLogin
                                onSuccess={handleLogin}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                    </div>
                )}
            </Box>
          </Container>
        </div>
    );

}

export default Home;
