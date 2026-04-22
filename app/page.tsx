'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import api from '../lib/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?featured=true&pageSize=8');
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to Amazon Clone</h1>
        <p style={styles.heroSubtitle}>Shop the best deals on thousands of products</p>
        <Link href="/products" style={styles.shopButton}>
          Shop Now
        </Link>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section style={styles.categories}>
        <h2 style={styles.sectionTitle}>Shop by Category</h2>
        <div style={styles.categoryGrid}>
          {['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Toys'].map((cat) => (
            <Link key={cat} href={`/products?category=${cat}`} style={styles.categoryCard}>
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center',
    borderRadius: '10px',
    marginBottom: '50px',
  },
  heroTitle: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '24px',
    marginBottom: '30px',
  },
  shopButton: {
    display: 'inline-block',
    padding: '15px 40px',
    backgroundColor: '#FF9900',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '50px',
  },
  sectionTitle: {
    fontSize: '32px',
    marginBottom: '30px',
    color: '#333',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
  },
  categories: {
    marginBottom: '50px',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  categoryCard: {
    padding: '30px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '18px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
};
