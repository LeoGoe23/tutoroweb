import React, { useState, useEffect } from 'react';
import TopRightButtons from '../components/TopRightButtons';
import LogoTopLeft from '../components/TopLeftLogo';

const getResponsiveStyles = () => {
  const isMobile = window.innerWidth < 600;

  return {
    container: {
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#fff',
      fontFamily: 'Segoe UI, sans-serif',
    } as React.CSSProperties,
    topBar: {
      position: 'absolute',
      top: isMobile ? 16 : 20,
      left: isMobile ? 16 : 90,
      right: isMobile ? 16 : 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as React.CSSProperties,
    leftSvg: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: isMobile ? 180 : 400,
    } as React.CSSProperties,
    rightSvg: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: isMobile ? 180 : 400,
    } as React.CSSProperties,
    teachSvg: {
      position: 'absolute',
      bottom: isMobile ? 40 : 50,
      left: isMobile ? '50%' : undefined,
      right: isMobile ? undefined : 160,
      transform: isMobile ? 'translateX(-50%)' : undefined,
      width: isMobile ? 360 : 500,
      display: isMobile ? 'none' : 'block',
    } as React.CSSProperties,
    headerContainer: {
      position: 'absolute',
      top: isMobile ? 200 : 140,
      left: isMobile ? undefined : 290,
      right: isMobile ? undefined : 20,
      width: isMobile ? '90%' : undefined,
      maxWidth: isMobile ? '100%' : 400,
      margin: isMobile ? '0 auto' : undefined,
      textAlign: isMobile ? 'center' : 'left',
    } as React.CSSProperties,
    title: {
      fontSize: isMobile ? 32 : 48,
      fontWeight: 800,
      color: '#222',
    } as React.CSSProperties,
    subtitle: {
      fontSize: isMobile ? 18 : 21,
      lineHeight: isMobile ? '28px' : '32px',
      color: '#444',
      margin: '20px 0 36px 0',
    } as React.CSSProperties,
    buttonGroup: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: 16,
      justifyContent: isMobile ? 'center' : 'flex-start',
      alignItems: isMobile ? 'center' : 'flex-start',
      textAlign: isMobile ? 'center' : 'left',
    } as React.CSSProperties,
    button: {
      backgroundColor: '#ff8050',
      color: '#fff',
      fontSize: 17,
      fontWeight: 600,
      padding: '16px 24px',
      borderRadius: 28,
      border: 'none',
      cursor: 'pointer',
      width: isMobile ? '100%' : 'auto',
      maxWidth: 300,
    } as React.CSSProperties,
    outlined: {
      backgroundColor: 'transparent',
      border: '2px solid #ff8050',
      color: '#ff8050',
    } as React.CSSProperties,
  };
};

const App: React.FC = () => {
  const [styles, setStyles] = useState(getResponsiveStyles());

  useEffect(() => {
    const handleResize = () => setStyles(getResponsiveStyles());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <LogoTopLeft />
        <TopRightButtons />
      </div>

      <img src="/svgs/blopleft.svg" alt="Blop Left" style={styles.leftSvg} />
      <img src="/svgs/blopright.svg" alt="Blop Right" style={styles.rightSvg} />
      <img src="/svgs/teach.svg" alt="Teach" style={styles.teachSvg} />

      <div style={styles.headerContainer}>
        <h1 style={styles.title}>KI Nachhilfe</h1>
        <p style={styles.subtitle}>
          Dein smarter Lernbegleiter für den Schulalltag.
          <br />
          Individuell, intuitiv und immer da.
        </p>
        <div style={styles.buttonGroup}>
          <button
            style={styles.button}
            onClick={() => (window.location.href = '/newsletter')}
          >
            Jetzt starten
          </button>
          <button
            style={{ ...styles.button, ...styles.outlined }}
            onClick={() => (window.location.href = '/info')}
          >
            Mehr erfahren
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
