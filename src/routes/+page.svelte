<svelte:head>
  <title>Tutoro - KI Nachhilfe</title>
</svelte:head>

<div class="hero">
  <div class="container">
    <div class="hero-content">
      <div class="text-content">
        <h1>KI Nachhilfe</h1>
        <p class="hero-subtitle">
          Dein smarter Lernbegleiter für den<br />
          Schulalltag.
        </p>
        <p class="hero-description">Individuell, intuitiv und immer da.</p>
        <div class="actions">
          <a href="/auth" class="btn primary">Jetzt starten</a>
          <a href="/auth" class="btn secondary">Mehr erfahren</a>
        </div>
      </div>
      <div class="hero-illustration">
        <div class="illustration-container">
          <img src="/svgs/teach.svg" alt="Teaching illustration" class="teach-illustration" />
        </div>
      </div>
    </div>
  </div>

  <!-- Decorative blobs -->
  <div class="blob blob-left">
    <img src="/svgs/blopleft.svg" alt="" />
  </div>
  <div class="blob blob-right">
    <img src="/svgs/blopright.svg" alt="" />
  </div>
</div>

<!-- Features Section -->
<section class="features">
  <div class="container">
    <div class="features-header">
      <h2>Warum Tutoro?</h2>
      <p>Entdecke die Vorteile unserer KI-basierten Nachhilfe</p>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <img src="/svgs/teach2.svg" alt="Personalized Learning" />
        </div>
        <h3>Personalisiertes Lernen</h3>
        <p>KI-gestützte Lernpfade, die sich an deinen Fortschritt anpassen und deine Schwächen gezielt stärken.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">
          <img src="/svgs/teach3.svg" alt="24/7 Availability" />
        </div>
        <h3>24/7 Verfügbar</h3>
        <p>Immer da, wenn du Hilfe brauchst. Keine Terminvereinbarung, keine Wartezeiten.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">
          <img src="/svgs/teach4.svg" alt="Interactive Learning" />
        </div>
        <h3>Interaktives Lernen</h3>
        <p>Spielerische Übungen und sofortiges Feedback für effektives und unterhaltsames Lernen.</p>
      </div>
    </div>
  </div>
</section>

<!-- Call to Action Section -->
<section class="cta">
  <div class="container">
    <div class="cta-content">
      <div class="cta-text">
        <h2>Bereit für bessere Noten?</h2>
        <p>Starte jetzt deine kostenlose Testphase und erlebe, wie KI-Nachhilfe dein Lernen revolutioniert.</p>
        <div class="cta-actions">
          <a href="/auth" class="btn primary large">Kostenlos starten</a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%);
    color: #1f2937;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
    position: relative;
    z-index: 2;
  }

  .hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    min-height: 70vh;
  }
  .text-content h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 0 0 1rem 0;
    color: white;
    line-height: 1.1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .hero-subtitle {
    font-size: 1.3rem;
    margin: 0 0 1rem 0;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    line-height: 1.4;
  }

  .hero-description {
    font-size: 1.1rem;
    margin: 0 0 2.5rem 0;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
  }

  .actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn {
    padding: 0.8rem 2rem;
    border-radius: 2rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
  }

  .btn.primary {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  }

  .btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
  }

  .btn.secondary {
    background: white;
    color: #f97316;
    border: 2px solid #f97316;
  }

  .btn.secondary:hover {
    background: #f97316;
    color: white;
    transform: translateY(-2px);
  }

  /* Hero Illustration */
  .hero-illustration {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .illustration-container {
    position: relative;
    width: 500px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .teach-illustration {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
  }

  /* Decorative blobs */
  .blob {
    position: absolute;
    opacity: 0.8;
    z-index: 1;
  }

  .blob img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .blob-left {
    width: 300px;
    height: 300px;
    bottom: 0%;
    left: -50px;
  }
  .blob-right {
    width: 250px;
    height: 250px;
    top: 0%;
    right: -25px;
  }

  /* Features Section */
  .features {
    padding: 80px 0;
    background: #f8fafc;
  }

  .features-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .features-header h2 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  .features-header p {
    font-size: 1.2rem;
    color: #6b7280;
    margin: 0;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 3rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .feature-card {
    background: white;
    padding: 2.5rem 2rem;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
  }

  .feature-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
    border-radius: 20px;
  }

  .feature-icon img {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }

  .feature-card h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  .feature-card p {
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }

  /* Call to Action Section */
  .cta {
    padding: 60px 0;
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
    color: white;
    position: relative;
    overflow: hidden;
  }

  .cta-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .cta-text {
    max-width: 600px;
  }

  .cta-text h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  .cta-text p {
    font-size: 1.1rem;
    margin: 0 0 2rem 0;
    line-height: 1.6;
  }

  .cta-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn.large {
    padding: 1rem 2.5rem;
    font-size: 1.125rem;
    border-radius: 2rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-content {
      grid-template-columns: 1fr;
      gap: 2rem;
      text-align: center;
    }

    .text-content h1 {
      font-size: 2.5rem;
    }

    .illustration-container {
      width: 350px;
      height: 280px;
    }

    .actions {
      justify-content: center;
    }
    .blob-left,
    .blob-right {
      display: none;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .cta-content {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
</style>
