'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>
          <Image src="/logo.svg" alt="Amazone" width={190} height={49} priority />
        </Link>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            🔍
          </button>
        </form>

        <nav style={styles.nav}>
          {user ? (
            <>
              <Link href="/account" style={styles.navLink}>
                Hello, {user.name}
              </Link>
              <Link href="/orders" style={styles.navLink}>
                Orders
              </Link>
              <button onClick={handleLogout} style={styles.navLink}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={styles.navLink}>
                Sign In
              </Link>
              <Link href="/register" style={styles.navLink}>
                Register
              </Link>
            </>
          )}
          <Link href="/cart" style={styles.cartLink}>
            🛒 Cart ({cartItemsCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#131921',
    color: 'white',
    padding: '10px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '0 20px',
  },
  logo: {
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  searchForm: {
    flex: 1,
    display: 'flex',
    maxWidth: '600px',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '4px 0 0 4px',
    fontSize: '16px',
  },
  searchButton: {
    padding: '10px 15px',
    backgroundColor: '#FF9900',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '18px',
  },
  nav: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  cartLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};
