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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router-dom';

export default function BasicTable(props) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: 'asc',
  });

  const onNoteEdit = (e) => {
    e.preventDefault();
    props.onNoteEdit(e.target.value);
  };

  const onNoteDelete = (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      'Вы уверены, что хотите удалить эту запись?'
    );
    if (confirmDelete) {
      props.onNoteDelete(e.target.value);
      console.log(e.target.value);
    }
  };

  const sortTable = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortedData = [...props.data];
    if (sortConfig.key !== null) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedData;
  }, [props.data, sortConfig]);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? (
        <ArrowUpwardIcon />
      ) : (
        <ArrowDownwardIcon />
      );
    }
    return null;
  };

  return (
    <TableContainer component={Paper} sx={{ marginTop: 3, maxWidth: 1200, marginX: 'auto' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell onClick={() => sortTable('number')}>
                Номер {renderSortIcon('number')}
            </TableCell>
            <TableCell sx={{ verticalAlign: 'middle' }} onClick={() => sortTable('name')}>
                Наименование {renderSortIcon('name')}
            </TableCell>
            <TableCell sx={{ verticalAlign: 'middle' }} onClick={() => sortTable('group')}>
                Серия {renderSortIcon('group')}
            </TableCell>
            <TableCell sx={{ verticalAlign: 'middle' }}>
                Ключевые слова
            </TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow
              key={row._id}
              style={{ cursor: 'pointer' }}
            >
              <TableCell onClick={() => navigate(`/note/${row._id}`)}>
                {row.number}
                {props.access ? `(${row._id})` : ''}
              </TableCell>
              <TableCell onClick={() => navigate(`/note/${row._id}`)}>{row.name}</TableCell>
              <TableCell onClick={() => navigate(`/note/${row._id}`)}>{row.group}</TableCell>
              <TableCell onClick={() => navigate(`/note/${row._id}`)}>
                {Array.isArray(row.tags) ? row.tags.join(', ') : String(row.tags)}
              </TableCell>
              <TableCell align="right">
                {props.access && (
                  <>
                    <Button onClick={onNoteEdit} value={row._id} sx={{ marginRight: 2 }}>
                      <EditIcon />
                      Изменить
                    </Button>
                    <Button onClick={onNoteDelete} value={row._id} variant="text">
                      <DeleteOutlineIcon />
                      Удалить
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
