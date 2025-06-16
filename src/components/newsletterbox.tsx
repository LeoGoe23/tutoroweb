import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const NewsletterBox: React.FC = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      console.warn('❌ Formular unvollständig:', form);
      return;
    }

    try {
      const ref = collection(db, 'newsletterSignups');
      const docRef = await addDoc(ref, {
        ...form,
        createdAt: serverTimestamp(),
      });
      console.log('✅ Dokument gespeichert unter ID:', docRef.id);
      setSubmitted(true);
    } catch (error: any) {
      console.error('❌ Fehler beim Speichern in Firestore:', error?.message || error);
    }
  };

  if (submitted) {
    return (
      <div style={{ ...styles.newsletterBox, ...(isMobile ? styles.mobileBox : {}) }}>
        <h1 style={styles.title}>Danke für deine Anmeldung! 🎉</h1>
        <p style={styles.description}>
          Wir benachrichtigen dich als Erstes, sobald es losgeht.
        </p>
      </div>
    );
  }

  return (
    <div style={{ ...styles.newsletterBox, ...(isMobile ? styles.mobileBox : {}) }}>
      <h1 style={styles.title}>Jetzt vorregistrieren</h1>
      <p style={styles.description}>
        Sei unter den Ersten, die unseren <span style={styles.highlight}>smarten Lernbegleiter</span> nutzen –<br />
        und sichere dir exklusive Vorteile zum Start!
      </p>
      <p style={styles.catch}>
        ✅ Frühbucher sparen beim Launch<br />
        ⏳ Nur für kurze Zeit verfügbar
      </p>
      <input
        style={styles.input}
        type="text"
        name="firstName"
        placeholder="Vorname"
        value={form.firstName}
        onChange={handleChange}
      />
      <input
        style={styles.input}
        type="text"
        name="lastName"
        placeholder="Nachname"
        value={form.lastName}
        onChange={handleChange}
      />
      <input
        style={styles.input}
        type="email"
        name="email"
        placeholder="Email-Adresse"
        value={form.email}
        onChange={handleChange}
      />
      <div style={{ marginTop: 16 }}>
        <button style={styles.submitButton} onClick={handleSubmit}>
          Frühzugang sichern
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  newsletterBox: {
    position: 'absolute',
    left: 150,
    top: '10%',
    maxWidth: 400,
    padding: 90,
    backgroundColor: '#fff',
    borderRadius: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    zIndex: 5,
  },
  mobileBox: {
    position: 'relative',
    left: 'auto',
    top: 'auto',
    padding: 30,
    margin: '40px auto',
    width: '90%',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
    lineHeight: 1.5,
  },
  catch: {
    fontSize: 15,
    color: '#2d2d7f',
    fontWeight: 600,
    marginBottom: 20,
    lineHeight: 1.6,
  },
  highlight: {
    color: '#2d2d7f',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    border: '1px solid #ccc',
    borderRadius: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'inherit',
  },
  submitButton: {
    width: '100%',
    background: 'linear-gradient(90deg, #ff7f50, #ff5f2e)',
    color: '#fff',
    border: 'none',
    padding: 14,
    fontSize: 16,
    borderRadius: 16,
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(255,127,80,0.3)',
  },
};

export default NewsletterBox;
