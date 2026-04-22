'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>
      {loading ? (
        <div style={styles.loading}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={styles.empty}>
          <p>You have no orders yet.</p>
          <Link href="/products" style={styles.shopLink}>Start Shopping</Link>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <strong>Order ID:</strong> {order._id.slice(-8)}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}
                </div>
              </div>
              <div style={styles.orderStatus}>
                <span style={order.isPaid ? styles.paid : styles.unpaid}>
                  {order.isPaid ? '✓ Paid' : 'Unpaid'}
                </span>
                <span style={order.isDelivered ? styles.delivered : styles.undelivered}>
                  {order.isDelivered ? '✓ Delivered' : 'Processing'}
                </span>
              </div>
              <div style={styles.orderItems}>
                {order.orderItems.map((item, index) => (
                  <div key={index} style={styles.orderItem}>
                    <img src={item.image} alt={item.name} style={styles.itemImage} />
                    <div style={styles.itemDetails}>
                      <Link href={`/products/${item.product}`} style={styles.itemName}>
                        {item.name}
                      </Link>
                      <p>Quantity: {item.qty}</p>
                      <p>Price: ₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  title: { fontSize: '32px', marginBottom: '30px' },
  loading: { textAlign: 'center', padding: '50px', fontSize: '18px' },
  empty: { textAlign: 'center', padding: '50px' },
  shopLink: { display: 'inline-block', marginTop: '20px', padding: '12px 30px', backgroundColor: '#FF9900', color: 'white', textDecoration: 'none', borderRadius: '4px' },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  orderCard: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' },
  orderStatus: { display: 'flex', gap: '20px', marginBottom: '20px' },
  paid: { color: '#28a745', fontWeight: 'bold' },
  unpaid: { color: '#dc3545', fontWeight: 'bold' },
  delivered: { color: '#28a745', fontWeight: 'bold' },
  undelivered: { color: '#ffc107', fontWeight: 'bold' },
  orderItems: { display: 'flex', flexDirection: 'column', gap: '15px' },
  orderItem: { display: 'flex', gap: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' },
  itemImage: { width: '80px', height: '80px', objectFit: 'contain' },
  itemDetails: { flex: 1 },
  itemName: { fontSize: '16px', fontWeight: '500', color: '#333', textDecoration: 'none' },
};
