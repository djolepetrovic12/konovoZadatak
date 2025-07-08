import { createContext,useEffect, useContext, useState } from 'react';
import axios from 'axios';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoggedIn,setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));


    useEffect(() => {
    const fetchProducts = async () => {
      if (!isLoggedIn) {
        setProducts([]);
        return;
      }
      try {
        const res = await axios.get('http://localhost:8000/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        });
        console.log(isLoggedIn);
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [isLoggedIn]);

  const clearProducts = () => setProducts([]);

  return (
    <ProductsContext.Provider value={{ isLoggedIn,setIsLoggedIn,products, setProducts, clearProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}