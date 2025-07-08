import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Products from './Products';
import ProductDetail from './ProductDetail';
import { ProductsProvider } from './ProductsContext.jsx';
import ProtectedRoutes from './ProtectedRoutes'
import RedirectToProducts from './RedirectToProducts.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProductsProvider>
      <Routes>
        <Route element={<RedirectToProducts/>}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoutes/>} >
          <Route path="/products" element={<Products />} />
          <Route path="/products/:sku" element={<ProductDetail />} />
        </Route>
      </Routes>
    </ProductsProvider>
  </BrowserRouter>
);
