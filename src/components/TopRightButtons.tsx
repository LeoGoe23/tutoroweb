import React, { useState, useEffect } from 'react';

const getResponsiveStyles = () => {
  const isMobile = window.innerWidth < 600;

  return {
    topBar: {
      position: 'absolute',
      top: 24,
      right: 24,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: 12,
      zIndex: 10,
      alignItems: 'flex-end',
    } as React.CSSProperties,
    loginButton: {
      backgroundColor: '#2d2d7f',
      color: '#fff',
      padding: isMobile ? '8px 16px' : '10px 20px',
      fontSize: 16,
      fontWeight: 600,
      border: 'none',
      borderRadius: 16,
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      width: isMobile ? '100%' : 'auto',
    } as React.CSSProperties,
    secondaryButton: {
      backgroundColor: '#fff',
      color: '#2d2d7f',
      border: '2px solid #2d2d7f',
      padding: isMobile ? '8px 16px' : '10px 20px',
      fontSize: 16,
      fontWeight: 600,
      borderRadius: 16,
      cursor: 'pointer',
      width: isMobile ? '100%' : 'auto',
    } as React.CSSProperties,
    overlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      padding: 16,
    } as React.CSSProperties,
    modal: {
      backgroundColor: '#fff',
      padding: isMobile ? 24 : 32,
      borderRadius: 20,
      maxWidth: 400,
      width: '100%',
      textAlign: 'center',
      boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
    } as React.CSSProperties,
    modalText: {
      fontSize: 18,
      marginBottom: 24,
      color: '#000',
      lineHeight: 1.5,
    } as React.CSSProperties,
    modalButton: {
      backgroundColor: '#2d2d7f',
      color: '#fff',
      padding: '12px 24px',
      fontSize: 16,
      fontWeight: 600,
      border: 'none',
      borderRadius: 12,
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    } as React.CSSProperties,
  };
};

const TopRightButtons: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [styles, setStyles] = useState(getResponsiveStyles());

  useEffect(() => {
    const handleResize = () => setStyles(getResponsiveStyles());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div style={styles.topBar}>
        <button onClick={() => setModalVisible(true)} style={styles.loginButton}>
          Login
        </button>
        <button onClick={() => setModalVisible(true)} style={styles.secondaryButton}>
          Kostenlos testen
        </button>
      </div>

      {modalVisible && (
        <div style={styles.overlay} onClick={() => setModalVisible(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p style={styles.modalText}>
              Diese Funktion kommt bald!<br />
              Melde dich schon vorab an und sichere dir exklusiven Zugang.
            </p>
            <button style={styles.modalButton} onClick={() => window.location.href = '/newsletter'}>
              Jetzt vormerken
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TopRightButtons;
