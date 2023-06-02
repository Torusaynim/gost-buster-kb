import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


export default function BasicTable(props) {
    const navigate = useNavigate();

    const onNoteEdit = (e) => {
        e.preventDefault()
        props.onNoteEdit(e.target.value);
    }

    const onNoteDelete = (e) => {
        e.preventDefault()
        console.log(e.target.value)
        props.onNoteDelete(e.target.value);
    }

    return (
        <TableContainer component={Paper} sx={{ marginTop: 3, maxWidth: 1200, marginX: 'auto' }}>
            {/* <p>User Access: {props.access.toString()}</p> */}
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Номер</TableCell>
                        <TableCell>Наименование</TableCell>
                        <TableCell>Серия</TableCell>
                        <TableCell>Ключевые слова</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map((row) => (
                        <TableRow
                            key={row._id}
                            // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            style={{ cursor: 'pointer' }}
                        >
                            <TableCell onClick={() => navigate(`/note/${row._id}`)}>
                                {row.number}
                                {props.access ? (
                                    <>
                                    ({row._id})
                                    </>
                                ) : (
                                    <>
                                    
                                    </>
                                )}
                            </TableCell>
                            <TableCell onClick={() => navigate(`/note/${row._id}`)}>{row.name}</TableCell>
                            <TableCell onClick={() => navigate(`/note/${row._id}`)}>{row.group}</TableCell>
                            <TableCell onClick={() => navigate(`/note/${row._id}`)}>{row.tags.join(', ')}</TableCell>
                            <TableCell align="right">
                                {props.access ? (
                                    <>
                                        <Button onClick={onNoteEdit} value={row._id} sx={{marginRight: 2}}><EditIcon/>Edit</Button>
                                        <Button onClick={onNoteDelete} value={row._id} variant="text"><DeleteOutlineIcon/>Delete</Button>
                                    </>
                                ) : (
                                    <>
                                    
                                    </>
                                )
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}