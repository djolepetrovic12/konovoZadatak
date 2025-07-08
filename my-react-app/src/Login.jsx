import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  InputLabel,

} from '@mui/material';
import { useProducts } from './ProductsContext';

export default function Login() {
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {setIsLoggedIn} = useProducts();


  const login = async (e) => {
    e.preventDefault(); // ovo je neophodno da bi post request mogao da se zavrsi do kraja jer bi klikom na ''prijavi se'' ucitalo ponovo stranicu i mozda se ne bi zavrsio login
    try {
      const res = await axios.post("http://localhost:8000/login", {
        username,
        password
      });
      const token = res.data.token;
      if(token)
      {
        localStorage.setItem('jwt', token);
        setIsLoggedIn(true);
        navigate('/products');
      }
      console.log('hello')

    } catch (err) {
      setError('Neuspešna prijava. Proverite podatke.');
      console.error("Login error:", err);

    }
  };

  return (

    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundImage: 'url(./slika.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: '30%', minWidth:'350px', backdropFilter: 'blur(6px)', bgcolor: 'rgba(255,255,255,0.8)' }}>
      <form onSubmit={login} >
        
        <div>
        <Typography variant="h5" align="center" gutterBottom>Prijava</Typography>
        </div>

        <div>
        <InputLabel id="username-label"></InputLabel>
        <TextField
        type='text'
        sx={{ width: '40%', margin:'10px'}}
        size='small'
        labelid="username-label" label="korisnicko ime"
        value={username} onChange={(e) => setUsername(e.target.value)}  required
        />
        </div>
        <div>
        <InputLabel id="password-label"></InputLabel>
        <TextField
        type='password'
        sx={{ width: '40%', margin:'10px'}}
        size='small'
        labelid="password-label" label="lozinka"
        value={password} onChange={(e) => setPassword(e.target.value)} required
        />
        </div>
        <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <div>
        <Button variant='contained' type="submit" >Prijavi se</Button>
        </div>

      </form>
    </Paper>
    </Box>
    
  );
}