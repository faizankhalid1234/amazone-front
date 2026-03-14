'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.topSection}>
        <div style={styles.section}>
          <h4 style={styles.heading}>Quick Links</h4>
          <Link href="/" style={styles.link}>Home</Link>
          <Link href="/products" style={styles.link}>Products</Link>
          <Link href="/cart" style={styles.link}>Cart</Link>
        </div>
        <div style={styles.section}>
          <h4 style={styles.heading}>Account</h4>
          <Link href="/login" style={styles.link}>Sign In</Link>
          <Link href="/register" style={styles.link}>Register</Link>
          <Link href="/orders" style={styles.link}>Orders</Link>
        </div>
        <div style={styles.section}>
          <h4 style={styles.heading}>Connect</h4>
          <a href="https://github.com/faizankhalid1234" target="_blank" rel="noopener noreferrer" style={styles.link}>
            GitHub
          </a>
          <a href="https://portfolio-faizan-topaz.vercel.app" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Portfolio
          </a>
        </div>
      </div>

      <div style={styles.bottomSection}>
        <p style={styles.copyright}>
          © {currentYear} Amazon Clone. All rights reserved.
        </p>
        <p style={styles.credit}>
          Made with ❤️ by{' '}
          <a href="https://portfolio-faizan-topaz.vercel.app" target="_blank" rel="noopener noreferrer" style={styles.nameLink}>
            Faizan Khalid
          </a>
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#131921',
    color: '#ccc',
    marginTop: '50px',
  },
  topSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px 30px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '30px',
    borderBottom: '1px solid #232f3e',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  heading: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '5px',
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '14px',
  },
  bottomSection: {
    padding: '20px',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '13px',
    marginBottom: '5px',
    color: '#999',
  },
  credit: {
    fontSize: '14px',
    color: '#ccc',
  },
  nameLink: {
    color: '#FF9900',
    textDecoration: 'none',
    fontWeight: '600',
  },
};
