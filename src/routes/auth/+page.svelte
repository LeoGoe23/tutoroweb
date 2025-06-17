<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const authCard = document.querySelector(".auth-card");

    if (!loginForm || !registerForm || !authCard) return;

    // Function to handle form transitions between login and register
    function switchToForm(isLoginTab: boolean): void {
      if (isLoginTab) {
        // Switch to login
        if (registerForm) {
          registerForm.style.opacity = "0";
        }

        setTimeout(() => {
          if (registerForm) registerForm.classList.add("hidden");
          if (loginForm) {
            loginForm.classList.remove("hidden");
            loginForm.style.opacity = "0";
            loginForm.style.transform = "translateX(-20px)";

            // Trigger reflow
            loginForm.offsetHeight;

            loginForm.style.opacity = "1";
            loginForm.style.transform = "translateX(0)";
          }
        }, 150);
      } else {
        // Switch to register
        if (loginForm) {
          loginForm.style.opacity = "0";
          loginForm.style.transform = "translateX(-20px)";
        }

        setTimeout(() => {
          if (loginForm) loginForm.classList.add("hidden");
          if (registerForm) {
            registerForm.classList.remove("hidden");
            registerForm.style.opacity = "0";
            registerForm.style.transform = "translateX(20px)";

            // Trigger reflow
            registerForm.offsetHeight;

            registerForm.style.opacity = "1";
            registerForm.style.transform = "translateX(0)";
          }
        }, 150);
      }
    }    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all tabs
        tabBtns.forEach((tab) => tab.classList.remove("active"));
        // Add active class to clicked tab
        btn.classList.add("active");

        // Animate form switch
        const tabType = btn.getAttribute("data-tab");
        switchToForm(tabType === "login");
      });
    });

    // Handle form submissions
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Simulate login process
        console.log("Login form submitted");
        // Redirect to dashboard
        window.location.href = "/dashboard";
      });
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Simulate registration process
        console.log("Register form submitted");
        // Redirect to dashboard
        window.location.href = "/dashboard";
      });
    }
  });
</script>

<svelte:head>
  <title>Anmelden - Tutoro</title>
</svelte:head>

<div class="auth-container">
  <div class="auth-card">
    <div class="auth-header">
      <div class="logo-section">
        <img src="/svgs/logo.svg" alt="Tutoro Logo" class="auth-logo" />
        <h1>Tutoro</h1>
      </div>
      <p class="auth-subtitle">Willkommen zurück! Melde dich an oder erstelle ein neues Konto.</p>
    </div>

    <div class="auth-tabs">
      <button class="tab-btn active" data-tab="login">Anmelden</button>
      <button class="tab-btn" data-tab="register">Registrieren</button>
    </div>

    <!-- Login Form -->
    <form class="auth-form" id="login-form">
      <div class="form-group">
        <label for="email">E-Mail</label>
        <input type="email" id="email" name="email" required placeholder="deine@email.de" />
      </div>
      <div class="form-group">
        <label for="password">Passwort</label>
        <input type="password" id="password" name="password" required placeholder="••••••••" />
      </div>
      <div class="form-options">
        <label class="checkbox">
          <input type="checkbox" />
          <span>Angemeldet bleiben</span>
        </label>
        <a href="/forgot-password" class="forgot-link">Passwort vergessen?</a>
      </div>
      <button type="submit" class="auth-btn primary">Anmelden</button>
    </form>
    <!-- Register Form -->
    <form class="auth-form hidden" id="register-form">
      <div class="form-row">
        <div class="form-group">
          <label for="reg-firstname">Vorname</label>
          <input type="text" id="reg-firstname" name="firstname" required placeholder="Max" />
        </div>
        <div class="form-group">
          <label for="reg-lastname">Nachname</label>
          <input type="text" id="reg-lastname" name="lastname" required placeholder="Mustermann" />
        </div>
      </div>
      <div class="form-group">
        <label for="reg-email">E-Mail</label>
        <input type="email" id="reg-email" name="email" required placeholder="deine@email.de" />
      </div>
      <div class="form-group">
        <label for="reg-password">Passwort</label>
        <input type="password" id="reg-password" name="password" required placeholder="••••••••" />
      </div>
      <div class="form-group">
        <label for="reg-confirm">Passwort bestätigen</label>
        <input type="password" id="reg-confirm" name="confirm" required placeholder="••••••••" />
      </div>
      <div class="form-options">
        <label class="checkbox">
          <input type="checkbox" required />
          <span>Ich akzeptiere die <a href="/terms">AGB</a> und <a href="/privacy">Datenschutzrichtlinien</a></span>
        </label>
      </div>
      <button type="submit" class="auth-btn primary">Kostenloses Konto erstellen</button>
    </form>

    <div class="auth-divider">
      <span>oder</span>
    </div>

    <div class="social-auth">
      <button class="social-btn google">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Mit Google anmelden
      </button>
    </div>
  </div>
</div>

<style>
  .auth-container {
    height: 100vh;
    background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    overflow: hidden;
  }
  .auth-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2.5rem;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideInUp {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  .auth-header {
    text-align: center;
    margin-bottom: 1rem;
  }

  .logo-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .auth-logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .auth-header h1 {
    color: #1f2937;
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
  }

  .auth-subtitle {
    color: #6b7280;
    font-size: 1rem;
    margin: 0;
    line-height: 1.5;
  }
  .auth-tabs {
    display: flex;
    background: #f3f4f6;
    border-radius: 0.75rem;
    padding: 0.25rem;
    margin-bottom: 1rem;
  }
  .tab-btn {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    color: #6b7280;
    font-weight: 600;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(1);
  }

  .tab-btn:hover {
    color: #4b5563;
    transform: scale(1.02);
  }

  .tab-btn.active {
    background: white;
    color: #6366f1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: scale(1.02);
  }
  .auth-form {
    display: block;
    opacity: 1;
    transform: translateX(0);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .auth-form.hidden {
    display: none;
  }

  .form-row {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .form-row .form-group {
    flex: 1;
    margin-bottom: 0;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #374151;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .form-group input {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: #6b7280;
  }

  .checkbox input {
    width: auto;
    margin: 0;
  }

  .forgot-link {
    color: #6366f1;
    text-decoration: none;
    font-weight: 600;
  }

  .forgot-link:hover {
    text-decoration: underline;
  }

  .auth-btn {
    width: 100%;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .auth-btn.primary {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }

  .auth-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }
  .auth-divider {
    text-align: center;
    margin: 1rem 0;
    position: relative;
    color: #9ca3af;
    font-size: 0.9rem;
  }

  .auth-divider::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
    z-index: 1;
  }

  .auth-divider span {
    background: white;
    padding: 0 1rem;
    position: relative;
    z-index: 2;
  }

  .social-auth {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    background: white;
    color: #374151;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .social-btn:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  .social-btn.google {
    color: #1f2937;
  }
  /* Responsive */
  @media (max-width: 480px) {
    .auth-container {
      padding: 0.5rem;
    }
    .auth-card {
      padding: 1rem;
    }

    .auth-header h1 {
      font-size: 1.75rem;
    }
    .form-options {
      flex-direction: column;
      gap: 0.75rem;
      align-items: flex-start;
    }

    .form-row {
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-row .form-group {
      margin-bottom: 0.5rem;
    }
  }
</style>
