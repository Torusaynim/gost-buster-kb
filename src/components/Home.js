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
    const [name, setName] = useState(null);
    const [group, setGroup] = useState(null);
    const [number, setNumber] = useState(null);
    const [status, setStatus] = useState(null);
    const [tags, setTags] = useState(null);
    const [links, setLinks] = useState(null);
    const [note, setNote] = useState(null);

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

    const handleNewNote = async (name, group, number, status, tags, links, note, file) => {
        console.log('handleNewNote')

        const formData = new FormData();
        formData.append('name', name);
        formData.append('group', group);
        formData.append('number', number);
        formData.append('status', status);

        const tagsArray = tags.split(', ');
        tagsArray.forEach((tag) => {
            formData.append('tagsArray[]', tag);
        });

        formData.append('note', note);

        const linksArray = links.split(', ');
        linksArray.forEach((link) => {
            formData.append('linksArray[]', link);
        });
        
        formData.append('file', file);
      
        await fetch(backUri + '/api/new-Note', {
          method: 'POST',
          body: formData,
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

        await handleGetAllNotes();
    };

    const handleEdit = async () => {
     
        await fetch(backUri+'/api/edit-Note', {
            method: 'POST',
            body: JSON.stringify({
                _id: noteId,
                name: name,
                group: group,
                number: number,
                status: status,
                tags: tags,
                links: links,
                note: note
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        setName(null);
        setGroup(null);
        setNumber(null);
        setStatus(null);
        setTags(null);
        setLinks(null);
        setNote(null);

        setOpenEdit(false)
        await handleGetAllNotes();
    };

    const handleChangeName = (e) => {
        setName(e.target.value)
    };
    const handleChangeGroup = (e) => {
        setGroup(e.target.value)
    };
    const handleChangeNumber = (e) => {
        setNumber(e.target.value)
    };
    const handleChangeStatus = (e) => {
        setStatus(e.target.value)
    };
    const handleChangeTags = (e) => {
        setTags(e.target.value)
    };
    const handleChangeLinks = (e) => {
        setLinks(e.target.value)
    };
    const handleChangeNote = (e) => {
        setNote(e.target.value)
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
                        <Dialog open={openEdit} onClose={handleCloseEdit} PaperProps={{ style: { maxWidth: '500px' } }}>
                            <DialogTitle>Изменить</DialogTitle>
                        
                            <DialogContent>
                                <form>

                                <TextField
                                    onChange={handleChangeName}
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Новое название"
                                    type="name"
                                    fullWidth
                                    variant="standard"
                                />
                                <TextField
                                    onChange={handleChangeGroup}
                                    autoFocus
                                    margin="dense"
                                    id="group"
                                    label="Новая серия"
                                    type="name"
                                    fullWidth
                                    variant="standard"
                                />
                                <TextField
                                    onChange={handleChangeNumber}
                                    autoFocus
                                    margin="dense"
                                    id="number"
                                    label="Новый номер"
                                    type="name"
                                    fullWidth
                                    variant="standard"
                                />
                                <TextField
                                    onChange={handleChangeStatus}
                                    autoFocus
                                    margin="dense"
                                    id="status"
                                    label="Новый номер"
                                    type="name"
                                    fullWidth
                                    variant="standard"
                                />
                                <TextField
                                    onChange={handleChangeTags}
                                    autoFocus
                                    margin="dense"
                                    id="tags"
                                    label="Изменить ключевые слова (разделенные запятой)"
                                    type="name"
                                    fullWidth
                                    variant="standard"
                                />
                                <TextField
                                    onChange={handleChangeLinks}
                                    autoFocus
                                    margin="dense"
                                    id="links"
                                    label="Изменить ссылочные записи (разделенные запятой)"
                                    type="name"
                                    fullWidth
                                    variant="standard"
                                />
                                <TextField
                                    onChange={handleChangeNote}
                                    autoFocus
                                    margin="dense"
                                    id="note"
                                    label="Изменить пояснение"
                                    type="name"
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
                            <Button variant="contained" onClick={handleGetAllNotes}>Показать все записи</Button>
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
                        <h1>Для работы с системой необходимо войти в систему</h1>
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
