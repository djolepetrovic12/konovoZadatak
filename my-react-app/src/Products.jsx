import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from './ProductsContext';
import ProductCard from './ProductCard';
import DOMPurify from 'dompurify';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Typography,
  Pagination,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import {useDebounce} from 'use-debounce';

export default function Products() {
  const navigate = useNavigate();
  const { products,setProducts, clearProducts,categories } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search,500);

  //pocetak Pagination sekcije
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  //kraj Pagination sekcije

  const token = localStorage.getItem('jwt');
  const savedString  = localStorage.getItem('categories') || '';
  const savedCategories = savedString ? savedString.split('-') : [];

  useEffect(() => {

  if (debouncedSearch.length === 0 || debouncedSearch.length >= 3) {
    fetchProducts();
  }
}, [debouncedSearch, category]);



const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/search', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
          params: {
            search: debouncedSearch || undefined,
            kategorija: category || undefined,
          },
        });
        setProducts(res.data);
        setCurrentPage(1);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      }
    };


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
      labelid="pretraga-label" label="Pretraga" value={search} onChange={(e) => setSearch(e.target.value)}
      />

      <FormControl
      sx={{ width: '40%', padding:'0px'}}
      fullWidth
      size='small'
      >
      <InputLabel id="category-label">Kategorija</InputLabel>
      <Select
        labelid="category-label"
        value={category}
        label="Kategorija"
        onChange={(e) => setCategory(e.target.value)}
      >
        <MenuItem value="">Sve kategorije</MenuItem>
        {[...savedCategories].map(cat => (
        <MenuItem key={cat} value={cat}>
          {cat}
        </MenuItem>
        ))}
      </Select>
      </FormControl>

      <Button 
      variant="outlined" 
      startIcon={<LogoutIcon />}
      onClick={() => {
        localStorage.removeItem('jwt');
        clearProducts();
        navigate('/');
      }}>
        Odjavi se
      </Button>

      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="start"
        alignItems="center"
        minHeight="100vh"
      >
      <Grid container justifyContent="center" spacing={2} mt={2}>
        {currentProducts.map((p,index) => (

        <Grid key={`${p.sku} - ${p.naziv} - ${index}`}>
          <ProductCard
          product={p}
          onClick={() => {
            const token2 = localStorage.getItem('jwt');
            if (!token2) {
              localStorage.clear();
              navigate('/');
            } else {
              navigate(`/products/${p.sku}`);
            }
          }}
          />
        </Grid>
          
        ))
        }
      </Grid>

      <Pagination
      count={totalPages}
      page={currentPage}
      onChange={(event, value) => setCurrentPage(value)}
      color="primary"
      sx={{ mt: 2 }}
      />
      </Box>      
    </div>
  );
}