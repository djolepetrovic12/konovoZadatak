import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from './ProductsContext';
import DOMPurify from 'dompurify';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import {useDebounce} from 'use-debounce';

export default function Products() {
  const navigate = useNavigate();
  const { products, clearProducts } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search,500);

  const token = localStorage.getItem('jwt');

   const uniqueCategories = [
    '',
    ...new Set(products.map(p => p.categoryName).filter(Boolean))
  ];



  useEffect(()=>{


    if (debouncedSearch.length === 0 || debouncedSearch.length >= 3) {

    let filtered = [...products];

    if(debouncedSearch.trim())
    {
        filtered = filtered.filter(p =>
        p.naziv.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
      );
    }

    if (category.trim()) {
        filtered = filtered.filter(p =>
        p.categoryName && p.categoryName.toLowerCase() === category.trim().toLowerCase()
    );
    }

    setFilteredProducts(filtered);
    console.log(filteredProducts);
    }

  },[debouncedSearch,category,products])


  return (
    <div>
      <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap={2}
      mt={2}
      >
      <InputLabel id="pretraga-label"></InputLabel>
      <TextField
      sx={{ width: '40%'}}
      size='small'
      labelId="pretraga-label" label="Pretraga" value={search} onChange={(e) => setSearch(e.target.value)}
      />

      <FormControl
      sx={{ width: '40%', padding:'0px'}}
      fullWidth
      size='small'
      >
      <InputLabel id="category-label">Kategorija</InputLabel>
      <Select
        labelId="category-label"
        value={category}
        label="Kategorija"
        onChange={(e) => setCategory(e.target.value)}
      >
        <MenuItem value="">Sve kategorije</MenuItem>
        {uniqueCategories
          .filter(cat => cat !== '')
          .map(cat => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
        ))}
      </Select>
      </FormControl>

      </Box>
      <ul>
        {filteredProducts.map((p,index) => (
            
          <li key={`${p.sku} - ${p.naziv} - ${index}`} onClick={() => {
            
            const token2 = localStorage.getItem('jwt');
            if(!token2)
            {
              localStorage.clear() // znam da ovde nema vise tokena, al za svaki slucaj sam izbrisao ako u buducnosti dodam nesto sto se cuva u local storage, a inace ne bih ni pisao ovu liniju koda jer svakako nema vise tokena u localStorage
              navigate('/')
              return;
            }
            else
              navigate(`/products/${p.sku}`);}}>
            
            {p.naziv} - {p.categoryName} - <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p.description) }} /> - {p.price}RSD
          </li>
          
        ))
        }
      </ul>

      <Button variant="outlined" onClick={() => {
        localStorage.removeItem('jwt');
        clearProducts();
        navigate('/');
      }}>
        Odjavi se
      </Button>
    </div>
  );
}