import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductCard = ({ product, onClick }) => {
  return (
    <Card
        onClick={onClick}
        sx={{ width: 280, m: 2, position: 'relative', cursor: 'pointer' }}
    >
        {product.imgsrc && (
        <CardMedia
        component="img"
        image={product.imgsrc}
        alt={product.naziv}
        />
         )}

        <CardContent>
        <Typography variant="h6" component="div" noWrap>
          {product.naziv}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
          {product.categoryName}
        </Typography>
        <Typography variant="body1" color="primary">
          {product.price} RSD
        </Typography>
      </CardContent>

      <CardActions>
        <Button 
        variant='contained'
        size="small"
        startIcon={<ShoppingCartIcon />}
        sx={{
            width:'100%'
        }}
        >
          Kupi
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;