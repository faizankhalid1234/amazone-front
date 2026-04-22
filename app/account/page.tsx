'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { toast } from 'react-toastify';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
        },
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Account</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.sectionTitle}>Personal Information</h2>
        <div style={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={styles.input}
          />
        </div>
        <h2 style={styles.sectionTitle}>Address</h2>
        <div style={styles.formGroup}>
          <label>Street</label>
          <input
            type="text"
            value={formData.address.street}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>City</label>
          <input
            type="text"
            value={formData.address.city}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>State</label>
          <input
            type="text"
            value={formData.address.state}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Zip Code</label>
          <input
            type="text"
            value={formData.address.zipCode}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Country</label>
          <input
            type="text"
            value={formData.address.country}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
            style={styles.input}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  title: { fontSize: '32px', marginBottom: '30px' },
  form: { backgroundColor: 'white', padding: '30px', borderRadius: '8px' },
  sectionTitle: { fontSize: '24px', marginTop: '30px', marginBottom: '20px' },
  formGroup: { marginBottom: '20px' },
  input: { width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' },
  button: { padding: '12px 30px', backgroundColor: '#FF9900', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
};
