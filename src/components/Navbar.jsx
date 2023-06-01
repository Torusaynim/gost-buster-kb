import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from '../assets/logo.png';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const drawerWidth = 240;
const navItems = [
    { label: 'На главную', link: '/home' },
    { label: 'О сервисе', link: '/about' },
    { label: 'Контакты', link: '/contacts' }
  ];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <div style={{ margin: '16px 0' }}>
        <Typography 
          component={Link} 
          to={'/'} 
          variant="h6"
          sx={{ my: 2, textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <img src={Logo} alt="логотип" />
            База знаний ГОСТ
        </Typography>
      </div>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} to={item.link} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <Button variant="contained" onClick={props.toggleTheme}>Сменить тему</Button>
      </List>
    </Box>
  );

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
  const searchResults = [
    { title: 'The Shawshank Redemption', id: "645e8e407098681515417824" },
    { title: 'The Godfather', id: "645e8e407098681515417824" },
    { title: 'The Dark Knight', id: "645e8e407098681515417824" },
    { title: 'American History X', id: "645e8e407098681515417824" },
    { title: 'Interstellar', id: "645e8e407098681515417824" },
    { title: 'Casablanca', id: "645e8e407098681515417824" },
    { title: 'City Lights', id: "645e8e407098681515417824" },
    { title: 'Psycho', id: "645e8e407098681515417824" },
    { title: 'The Green Mile', id: "645e8e407098681515417824" },
    { title: 'The Intouchables', id: "645e8e407098681515417824" },
    { title: 'Modern Times', id: "645e8e407098681515417824" },
    { title: 'Raiders of the Lost Ark', id: "645e8e407098681515417824" },
    { title: 'Rear Window', id: "645e8e407098681515417824" },
    // Replace with parsing notes from DB...
  ];
  
  const StyledInputBase = styled('div')(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 4),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
  });

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    limit: 10,
  });
  
  function SearchWithAutocomplete() {
    return (
      <Autocomplete
        freeSolo
        options={searchResults.map((option) => option.title)}
        filterOptions={filterOptions}
        renderInput={(params) => (
          <StyledInputBase>
            <TextField
              {...params}
              placeholder="Введите запрос…"
              InputProps={{
                ...params.InputProps,
                'aria-label': 'search',
              }}
            />
          </StyledInputBase>
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <StyledLink to={`/note/${searchResults.find((result) => result.title === option)?.id}`}>
              {option}
            </StyledLink>
          </li>
        )}
      />
    );
  }

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={'/'}
            sx={{ display: { xs: 'none', sm: 'flex' }, textDecoration: 'none', color: 'inherit', alignItems: 'center' }}
          >
            <img src={Logo} alt="логотип" style={{ marginRight: '16px' }} />
            База знаний в области ГОСТ
          </Typography>
          <Search sx={{ flexGrow: 1 }}>
            <SearchWithAutocomplete />
          </Search>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button component={Link} to={item.link} key={item.label} sx={{ color: '#fff', textAlign: 'center' }}>
                {item.label}
              </Button>
            ))}
            <Button variant="contained" onClick={props.toggleTheme} >Сменить тему</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
