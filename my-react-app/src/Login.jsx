import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/products');
    }
  }, [token, navigate]);

  const login = async (e) => {
    e.preventDefault(); // ovo je neophodno da bi post request mogao da se zavrsi do kraja jer bi klikom na ''prijavi se'' ucitalo ponovo stranicu i mozda se ne bi zavrsio login
    try {
      const res = await axios.post("http://localhost:8000/login", {
        username,
        password
      });
      const token = res.data.token;
      //console.log(res.data);
      if(token)
      {
        localStorage.setItem('jwt', token);
        setToken(token);
        navigate('/products');
      }
      console.log('hello')

    } catch (err) {
      setError('Neuspešna prijava. Proverite podatke.');
      console.error("Login error:", err);

    }
  };

  return (
    <div>
    <form onSubmit={login} >
      <h2>Prijava</h2>
      {error && <p>{error}</p>}
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Korisničko ime"  required/>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Lozinka" required/>
      <button type="submit" >Prijavi se</button>
    </form>
    </div>
  );
}