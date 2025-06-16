import React, { useEffect, useState } from 'react';
import TopRightButtons from '../components/TopRightButtons';
import LogoTopLeft from '../components/TopLeftLogo';

const sections = [
  {
    img: '/svgs/teach.svg',
    title: 'Individuelles Lernen',
    text: 'Tutoro begleitet dich mit smarten Lernwegen – genau angepasst auf deinen Stil.',
  },
  {
    img: '/svgs/teach2.svg',
    title: 'Motivation im Alltag',
    text: 'Bleib dran – mit Fortschrittsanzeige, täglichen Zielen und Erfolgserlebnissen.',
  },
  {
    img: '/svgs/teach3.svg',
    title: 'Intuitiv & Einfach',
    text: 'Ein klarer Fokus auf Einfachheit: Kein Schnickschnack, nur effektives Lernen.',
  },
  {
    img: '/svgs/teach4.svg',
    title: 'Immer da, wenn du willst',
    text: 'Dein Lernpartner ist jederzeit einsatzbereit – egal ob für Prüfungen oder Wiederholung.',
  },
];

const getResponsiveStyles = () => {
  const isMobile = window.innerWidth < 600;

  return {
    isMobile,
    container: {
      position: 'relative',
      width: '100vw',
      minHeight: '100vh',
      overflowX: 'hidden',
      background: '#fff',
      fontFamily: 'Segoe UI, sans-serif',
      paddingBottom: 120,
    } as React.CSSProperties,
    topBar: {
      position: 'absolute',
      top: isMobile ? 16 : 20,
      left: isMobile ? 16 : 90,
      right: isMobile ? 16 : 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10,
    } as React.CSSProperties,
    rightSvg: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: isMobile ? 180 : 400,
    } as React.CSSProperties,
    contentWrapper: {
      marginTop: isMobile ? 140 : 220,
      paddingLeft: 40,
      paddingRight: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 100,
    } as React.CSSProperties,
    section: {
      display: 'flex',
      alignItems: 'center',
      gap: 80,
      flexWrap: 'wrap',
    } as React.CSSProperties,
    teachSvg: {
      maxWidth: '100%',
    } as React.CSSProperties,
    textBlock: {} as React.CSSProperties,
    title: {
      fontWeight: 700,
      marginBottom: 10,
      color: '#222',
    } as React.CSSProperties,
    description: {
      lineHeight: 1.6,
      color: '#444',
      margin: 0,
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

      <img src="/svgs/blopright.svg" alt="Blop Right" style={styles.rightSvg} />

      <div style={styles.contentWrapper}>
        {sections.map((section, index) => {
          const isEven = index % 2 === 0;
          const direction = styles.isMobile ? 'column' : isEven ? 'row' : 'row-reverse';
          const justify = styles.isMobile ? 'center' : index === 0 ? 'flex-start' : 'center';
          return (
            <div
              key={index}
              style={{
                ...styles.section,
                flexDirection: direction,
                justifyContent: justify,
                textAlign: styles.isMobile ? 'center' : 'left',
                paddingLeft: index === 0 && !styles.isMobile ? 80 : 0,
              }}
            >
              <img
                src={section.img}
                alt={`Teach ${index + 1}`}
                style={{
                  ...styles.teachSvg,
                  width: styles.isMobile ? 240 : 420,
                }}
              />
              <div
                style={{
                  ...styles.textBlock,
                  maxWidth: styles.isMobile ? 320 : 540,
                }}
              >
                <h2
                  style={{
                    ...styles.title,
                    fontSize: styles.isMobile ? 22 : 32,
                  }}
                >
                  {section.title}
                </h2>
                <p
                  style={{
                    ...styles.description,
                    fontSize: styles.isMobile ? 15 : 19,
                  }}
                >
                  {section.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
