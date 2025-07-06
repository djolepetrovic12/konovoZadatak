import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Products from './Products';
import ProductDetail from './ProductDetail';
import { ProductsProvider } from './ProductsContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProductsProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:sku" element={<ProductDetail />} />
      </Routes>
    </ProductsProvider>
  </BrowserRouter>
);
