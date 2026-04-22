'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful');
      router.push('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      await demoLogin();
      toast.success('Demo login successful');
      router.push('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Demo login failed');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Sign In</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.registerLink}>
          Don&apos;t have an account? <Link href="/register">Register here</Link>
        </p>
      </div>
      <div style={styles.demoContainer}>
        <h2 style={styles.demoTitle}>Quick Demo Access</h2>
        <p style={styles.demoText}>
          Instantly login with a demo account and quickly explore the full website experience.
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={demoLoading || loading}
          style={styles.demoButton}
        >
          {demoLoading ? 'Logging in...' : 'Login as Demo User'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    minHeight: '70vh',
    padding: '20px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    marginTop: '5px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#FF9900',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
  },
  demoContainer: {
    width: '100%',
    maxWidth: '360px',
    backgroundColor: '#fff8ef',
    border: '1px solid #ffd6a1',
    borderRadius: '8px',
    padding: '28px 24px',
  },
  demoTitle: {
    fontSize: '22px',
    marginBottom: '10px',
    color: '#131921',
  },
  demoText: {
    fontSize: '15px',
    color: '#444',
    lineHeight: 1.5,
    marginBottom: '18px',
  },
  demoButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#131921',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
