import React, { useState, useEffect } from 'react';
import TopRightButtons from '../components/TopRightButtons';
import LogoTopLeft from '../components/TopLeftLogo';
import NewsletterBox from '../components/newsletterbox';

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={styles.container}>
      <div style={isMobile ? styles.topBarMobile : styles.topBar}>
        <LogoTopLeft />
        <TopRightButtons />
      </div>

      <div style={{ ...styles.newsletterWrapper, marginTop: isMobile ? 160 : 80 }}>
        <NewsletterBox />
      </div>

      <img
        src="/svgs/blopright.svg"
        alt="Blop Right"
        style={isMobile ? styles.rightSvgMobile : styles.rightSvg}
      />
      {!isMobile && (
        <img src="/svgs/teach.svg" alt="Teach" style={styles.teachSvg} />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#fff',
    fontFamily: 'Segoe UI, sans-serif',
  },
  topBar: {
    position: 'absolute',
    top: 20,
    left: 90,
    right: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topBarMobile: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  rightSvg: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 400,
  },
  rightSvgMobile: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 180,
  },
  teachSvg: {
    position: 'absolute',
    right: 160,
    bottom: 50,
    width: 500,
  },
  newsletterWrapper: {
    position: 'relative',
    zIndex: 5,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
};

export default App;
