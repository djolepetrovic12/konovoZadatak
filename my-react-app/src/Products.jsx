import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from './ProductsContext';
import DOMPurify from 'dompurify';

export default function Products() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
  }, [token]);

  useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(search);
  }, 2000);

  return () => {
    clearTimeout(handler);
  };
}, [search]);


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
      <h2>Proizvodi</h2>
      <input placeholder="Pretraga" value={search} onChange={(e) => setSearch(e.target.value)} />
      <input placeholder="Kategorija" value={category} onChange={(e) => setCategory(e.target.value)} />


      <ul>
        {filteredProducts.map(p => (
            
          <li key={`${p.sku} - ${p.naziv}`} onClick={() => navigate(`/products/${p.sku}`)}>
            
            {p.naziv} - {p.categoryName} - <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p.description) }} /> - {p.price}RSD
          </li>
          
        ))
        }
      </ul>

      <button onClick={() => {
        localStorage.removeItem('jwt');
        navigate('/');
      }}>
        Odjavi se
      </button>
    </div>
  );
}