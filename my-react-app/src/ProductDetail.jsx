import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProducts } from './ProductsContext';
import DOMPurify from 'dompurify';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ProductDetail() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const token = localStorage.getItem('jwt');

  useEffect(() => {
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
      navigate(-1);
    })
  }, [sku, token, navigate]);

   if (!product)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  return (

    <Box p={4} display="flex" flexDirection="column" alignItems="center" sx={{width:'100%'}}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: 'flex-start', mb: 2 }}
        onClick={() => navigate(-1)}
      >
        Nazad
      </Button>

      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, maxWidth: 1600, width: '100%', boxShadow: 4, p:2 }}>
        {product.imgsrc && (
          <CardMedia
            component="img"
            image={product.imgsrc}
            alt={product.naziv}
            sx={{
              width: { xs: '100%', md: 600 },
              height: { xs: 250, md: 'auto' },
              objectFit: 'cover',
              borderRadius: 2,
            }}
          />
        )}

        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {`${product.naziv} ${product.brandName ? ` (${product.brandName})` : ''}`}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Kategorija: {product.categoryName}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Opis:</strong>{' '}
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.opis || product.description),
              }}
            />
          </Typography>

          <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
            {product.price} RSD
          </Typography>

          <Typography variant="body2" color="text.secondary">
            SKU: {product.sku}
          </Typography>
        </CardContent>
      </Card>
    </Box>




  );
}