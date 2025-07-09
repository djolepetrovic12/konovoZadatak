import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProducts } from './ProductsContext';
import DOMPurify from 'dompurify';
import axios from 'axios';
import {
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ProductDetail() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    console.log(sku);
    axios.get(`http://localhost:8000/products/${sku}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      setProduct(res.data);
    })
    .catch(err => {
      console.error('Failed to load product:', err);
      //navigate('/products');
    })
  }, [sku, token, navigate]);

  if (!product) return <div>Učitavanje...</div>;

  return (
    <div>
      <Button 
        variant='contained' 
        startIcon={<ArrowBackIcon />}
        sx={{ width: '10%', minWidth:"100px", margin:'10px'}}
        onClick={() => navigate(-1)}
      >
      Nazad
      </Button>
      <h2>{product.naziv}</h2>
      <p><strong>Kategorija:</strong> {product.categoryName}</p>
      <p><strong>Opis:</strong><span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.opis || product.description) }} /></p>
      <img src={product.imgsrc} alt={product.naziv} width={100} height="auto" />
      <p><strong>Cena:</strong> {product.price} RSD</p>
      <p><strong>SKU:</strong> {product.sku}</p>
    </div>
  );
}