'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface CartItem {
  product: string;
  image: string;
  name: string;
  price: number;
  qty: number;
  countInStock: number;
}

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleUpdateQty = async (productId: string, qty: number) => {
    try {
      await updateCartItem(productId, qty);
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cart.total || 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (!user) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>
      {cart.items && cart.items.length === 0 ? (
        <div style={styles.emptyCart}>
          <p>Your cart is empty</p>
          <Link href="/products" style={styles.shopLink}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div style={styles.cartContainer}>
          <div style={styles.itemsSection}>
            {cart.items.map((item: CartItem) => (
              <div key={item.product} style={styles.cartItem}>
                <img src={item.image} alt={item.name} style={styles.itemImage} />
                <div style={styles.itemDetails}>
                  <Link href={`/products/${item.product}`} style={styles.itemName}>
                    {item.name}
                  </Link>
                  <p style={styles.itemPrice}>₹{item.price.toLocaleString()}</p>
                </div>
                <div style={styles.itemActions}>
                  <select
                    value={item.qty}
                    onChange={(e) => handleUpdateQty(item.product, Number(e.target.value))}
                    style={styles.qtySelect}
                  >
                    {[...Array(Math.min(item.countInStock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemove(item.product)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
                <div style={styles.itemTotal}>
                  ₹{(item.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div style={styles.summarySection}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Tax (18%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRowTotal}>
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <Link href="/checkout" style={styles.checkoutButton}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '50px',
  },
  shopLink: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '12px 30px',
    backgroundColor: '#FF9900',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
  cartContainer: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px',
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '150px 2fr 200px 100px',
    gap: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: '150px',
    objectFit: 'contain',
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  itemName: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#333',
    textDecoration: 'none',
  },
  itemPrice: {
    fontSize: '16px',
    color: '#666',
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  qtySelect: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  removeButton: {
    padding: '8px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  itemTotal: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#B12704',
  },
  summarySection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    height: 'fit-content',
    position: 'sticky',
    top: '100px',
  },
  summaryTitle: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    fontSize: '16px',
  },
  summaryRowTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '2px solid #eee',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  checkoutButton: {
    display: 'block',
    width: '100%',
    padding: '15px',
    backgroundColor: '#FF9900',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '20px',
  },
};
