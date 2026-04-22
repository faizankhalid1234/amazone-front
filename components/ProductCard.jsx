'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success('Item added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product._id}`} style={styles.card}>
      <div style={styles.imageContainer}>
        {discount > 0 && <span style={styles.discountBadge}>-{discount}%</span>}
        <img src={product.image} alt={product.name} style={styles.image} />
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.brand}>{product.brand}</p>
        <div style={styles.rating}>
          {'⭐'.repeat(Math.floor(product.rating || 0))} ({product.numReviews || 0})
        </div>
        <div style={styles.priceContainer}>
          <span style={styles.price}>₹{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span style={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        {product.countInStock > 0 ? (
          <button onClick={handleAddToCart} style={styles.addButton}>
            Add to Cart
          </button>
        ) : (
          <div style={styles.outOfStock}>Out of Stock</div>
        )}
      </div>
    </Link>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '75%',
    backgroundColor: '#f5f5f5',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '10px',
  },
  discountBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 1,
  },
  content: {
    padding: '15px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '5px',
    color: '#333',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  brand: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  rating: {
    fontSize: '12px',
    marginBottom: '10px',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#B12704',
  },
  originalPrice: {
    fontSize: '14px',
    color: '#999',
    textDecoration: 'line-through',
  },
  addButton: {
    marginTop: 'auto',
    padding: '10px',
    backgroundColor: '#FF9900',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  outOfStock: {
    marginTop: 'auto',
    padding: '10px',
    backgroundColor: '#ccc',
    color: '#666',
    textAlign: 'center',
    borderRadius: '4px',
    fontSize: '14px',
  },
};
