import React, { useEffect, useState } from 'react';

const LogoTopLeft: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <a href="/" style={styles.link}>
      <div style={styles.logoContainer}>
        <img
          src="/svgs/logo.svg"
          alt="Logo"
          style={{
            ...styles.logo,
            height: isMobile ? 90 : 70,
          }}
        />
        {!isMobile && <span style={styles.logoText}>Tutoro</span>}
      </div>
    </a>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  link: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    height: 70,
    transition: 'height 0.3s',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 700,
    color: '#222',
  },
};

export default LogoTopLeft;
