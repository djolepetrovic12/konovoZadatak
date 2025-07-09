import { createContext,useEffect, useContext, useState } from 'react';
import axios from 'axios';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoggedIn,setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));
  const [categories, setCategories] = useState([]);

  const clearProducts = () => setProducts([]);

  return (
    <ProductsContext.Provider value={{ isLoggedIn,setIsLoggedIn,products, setProducts, clearProducts,categories,setCategories }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}