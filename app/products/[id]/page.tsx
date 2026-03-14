'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { toast } from 'react-toastify';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${params.id}`);
      setProduct(data);
    } catch (error) {
      toast.error('Product not found');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    try {
      await addToCart(product._id, qty);
      toast.success('Item added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    try {
      await api.post(`/products/${params.id}/reviews`, { rating, comment });
      toast.success('Review submitted');
      setComment('');
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!product) {
    return null;
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.productContainer}>
        <div style={styles.imageSection}>
          <img src={product.image} alt={product.name} style={styles.mainImage} />
        </div>
        <div style={styles.detailsSection}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.brand}>Brand: {product.brand}</p>
          <div style={styles.rating}>
            {'⭐'.repeat(Math.floor(product.rating || 0))} ({product.numReviews} reviews)
          </div>
          <div style={styles.priceContainer}>
            <span style={styles.price}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span style={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
                <span style={styles.discount}>-{discount}%</span>
              </>
            )}
          </div>
          <p style={styles.description}>{product.description}</p>
          <div style={styles.stock}>
            {product.countInStock > 0 ? (
              <span style={styles.inStock}>In Stock ({product.countInStock} available)</span>
            ) : (
              <span style={styles.outOfStock}>Out of Stock</span>
            )}
          </div>
          {product.countInStock > 0 && (
            <div style={styles.addToCartSection}>
              <div style={styles.qtySelector}>
                <label>Quantity: </label>
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                  {[...Array(Math.min(product.countInStock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={handleAddToCart} style={styles.addButton}>
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={styles.reviewsSection}>
        <h2>Customer Reviews</h2>
        {user && (
          <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
            <div style={styles.formGroup}>
              <label>Rating:</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Comment:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                style={styles.textarea}
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Submit Review
            </button>
          </form>
        )}
        <div style={styles.reviewsList}>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} style={styles.review}>
                <div style={styles.reviewHeader}>
                  <strong>{review.name}</strong>
                  <span>{'⭐'.repeat(review.rating)}</span>
                </div>
                <p style={styles.reviewComment}>{review.comment}</p>
                <small style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  productContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '50px',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
  },
  imageSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
  },
  mainImage: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  },
  detailsSection: {},
  title: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#333',
  },
  brand: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '10px',
  },
  rating: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  price: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#B12704',
  },
  originalPrice: {
    fontSize: '20px',
    color: '#999',
    textDecoration: 'line-through',
  },
  discount: {
    fontSize: '16px',
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '20px',
    color: '#555',
  },
  stock: {
    marginBottom: '20px',
  },
  inStock: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  outOfStock: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  addToCartSection: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  qtySelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  addButton: {
    padding: '12px 30px',
    backgroundColor: '#FF9900',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  reviewsSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
  },
  reviewForm: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  review: {
    padding: '15px',
    borderBottom: '1px solid #eee',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  reviewComment: {
    marginBottom: '5px',
    color: '#555',
  },
  reviewDate: {
    color: '#999',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
  },
};
