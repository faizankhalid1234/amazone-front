'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { toast } from 'react-toastify';

interface CartItem {
  product: string;
  image: string;
  name: string;
  price: number;
  qty: number;
  countInStock: number;
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (cart.items.length === 0) {
      router.push('/cart');
    }
  }, [user, cart, router]);

  const subtotal = cart.total || 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.items,
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };
      await api.post('/orders', orderData);
      await clearCart();
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.items.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.sections}>
          <div style={styles.section}>
            <h2>Shipping Address</h2>
            <div style={styles.formGroup}>
              <label>Address</label>
              <input
                type="text"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Country</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <h2 style={{ marginTop: '30px' }}>Payment Method</h2>
            <div style={styles.formGroup}>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={styles.input}
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>
          <div style={styles.summary}>
            <h2>Order Summary</h2>
            {cart.items.map((item: CartItem) => (
              <div key={item.product} style={styles.summaryItem}>
                <span>{item.name} x {item.qty}</span>
                <span>₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Tax:</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRowTotal}>
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  title: { fontSize: '32px', marginBottom: '30px' },
  form: { backgroundColor: 'white', padding: '30px', borderRadius: '8px' },
  sections: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' },
  section: {},
  formGroup: { marginBottom: '20px' },
  input: { width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' },
  summary: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  summaryRowTotal: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #ddd', fontSize: '20px', fontWeight: 'bold' },
  button: { width: '100%', padding: '15px', backgroundColor: '#FF9900', color: 'white', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' },
};
