import { createContext,useEffect, useContext, useState } from 'react';
import axios from 'axios';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem('jwt');

    useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        setProducts([]);
        return;
      }
      try {
        const res = await axios.get('http://localhost:8000/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [token]);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}