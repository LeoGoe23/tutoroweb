<script lang="ts">
  import { onMount } from "svelte";
  import { user, userProfile } from "$lib/auth";
  import { userProfileService } from "$lib/userProfile";
  import SubscriptionStatus from "$lib/components/SubscriptionStatus.svelte";

  let userName = "Max Mustermann";
  let userStats = {
    totalSessions: 24,
    weeklyProgress: 85,
    streakDays: 7,
    completedLessons: 156,
  }; // Update user name and stats when user profile is loaded
  $: if ($userProfile) {
    userName =
      $userProfile.displayName ||
      $userProfile.firstName + ($userProfile.lastName ? ` ${$userProfile.lastName}` : "") ||
      "User";
    if ($userProfile.stats) {
      userStats = { ...userStats, ...$userProfile.stats };
    }
  } else if ($user) {
    // Fallback if profile hasn't loaded yet
    userName = $user.displayName || $user.email?.split("@")[0] || "User";
  }

  let recentActivities = [
    { id: 1, subject: "Mathematik", topic: "Quadratische Gleichungen", time: "vor 2 Stunden", progress: 95 },
    { id: 2, subject: "Physik", topic: "Mechanik", time: "vor 1 Tag", progress: 78 },
    { id: 3, subject: "Chemie", topic: "Periodensystem", time: "vor 2 Tagen", progress: 89 },
    { id: 4, subject: "Deutsch", topic: "Gedichtanalyse", time: "vor 3 Tagen", progress: 92 },
  ];

  let upcomingLessons = [
    { id: 1, subject: "Mathematik", topic: "Logarithmus", time: "14:00", difficulty: "Mittel" },
    { id: 2, subject: "Englisch", topic: "Past Perfect", time: "16:30", difficulty: "Leicht" },
    { id: 3, subject: "Geschichte", topic: "Weimarer Republik", time: "Morgen 10:00", difficulty: "Schwer" },
  ];

  onMount(() => {
    // Simulate loading user data
    console.log("Dashboard loaded for user:", userName);
  });
</script>

<svelte:head>
  <title>Dashboard - Tutoro</title>
</svelte:head>

<div class="dashboard">
  <!-- Header -->
  <div class="dashboard-header">
    <div class="welcome-section">
      <h1>Willkommen zurück, {userName}!</h1>
      <p>Bereit für deine nächste Lernsession?</p>
    </div>
    <div class="header-actions">
      <button class="btn secondary">Profil</button>
      <button class="btn primary">Neue Session</button>
    </div>
  </div>

  <!-- Stats Overview -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon sessions">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.16.21 2.76.21 3.91 0C20.16 27 24 22.55 24 17V7l-10-5z" />
        </svg>
      </div>
      <div class="stat-content">
        <h3>{userStats.totalSessions}</h3>
        <p>Gesamte Sessions</p>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon progress">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22,4 12,14.01 9,11.01" />
        </svg>
      </div>
      <div class="stat-content">
        <h3>{userStats.weeklyProgress}%</h3>
        <p>Wochenfortschritt</p>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon streak">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
          />
        </svg>
      </div>
      <div class="stat-content">
        <h3>{userStats.streakDays}</h3>
        <p>Tage Streak</p>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon lessons">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      </div>
      <div class="stat-content">
        <h3>{userStats.completedLessons}</h3>
        <p>Abgeschlossene Lektionen</p>
      </div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="content-grid">
    <!-- Recent Activities -->
    <div class="dashboard-card">
      <div class="card-header">
        <h2>Letzte Aktivitäten</h2>
        <a href="/activities" class="view-all">Alle anzeigen</a>
      </div>
      <div class="activities-list">
        {#each recentActivities as activity}
          <div class="activity-item">
            <div class="activity-info">
              <div class="subject-badge {activity.subject.toLowerCase()}">{activity.subject}</div>
              <div class="activity-details">
                <h4>{activity.topic}</h4>
                <span class="time">{activity.time}</span>
              </div>
            </div>
            <div class="activity-progress">
              <div class="progress-circle">
                <span>{activity.progress}%</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Upcoming Lessons -->
    <div class="dashboard-card">
      <div class="card-header">
        <h2>Anstehende Lektionen</h2>
        <a href="/schedule" class="view-all">Zeitplan</a>
      </div>
      <div class="lessons-list">
        {#each upcomingLessons as lesson}
          <div class="lesson-item">
            <div class="lesson-time">{lesson.time}</div>
            <div class="lesson-content">
              <h4>{lesson.topic}</h4>
              <div class="lesson-meta">
                <span class="subject">{lesson.subject}</span>
                <span class="difficulty {lesson.difficulty.toLowerCase()}">{lesson.difficulty}</span>
              </div>
            </div>
            <button class="btn small primary">Starten</button>
          </div>
        {/each}
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="dashboard-card quick-actions">
      <div class="card-header">
        <h2>Schnellzugriff</h2>
      </div>
      <div class="actions-grid">
        <button class="action-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
          </svg>
          <span>Neue Aufgabe</span>
        </button>
        <button class="action-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
          <span>Quiz starten</span>
        </button>
        <button class="action-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <span>Fortschritt</span>
        </button>
        <button class="action-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>KI-Tutor</span>
        </button>
      </div>
    </div>

    <!-- Subscription Status -->
    <div class="dashboard-card subscription-card">
      <div class="card-header">
        <h2>Abonnement Status</h2>
      </div>
      <SubscriptionStatus />
    </div>
  </div>
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: #f8fafc;
    min-height: 100vh;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .welcome-section h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  .welcome-section p {
    color: #6b7280;
    margin: 0;
    font-size: 1.1rem;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn.primary {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }

  .btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }

  .btn.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 2px solid #e5e7eb;
  }

  .btn.secondary:hover {
    background: #e5e7eb;
  }

  .btn.small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .stat-icon.sessions {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  }
  .stat-icon.progress {
    background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  }
  .stat-icon.streak {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  .stat-icon.lessons {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  }

  .stat-content h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .stat-content p {
    color: #6b7280;
    margin: 0;
    font-size: 0.875rem;
  }
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .subscription-card {
    grid-column: 1 / -1; /* Make subscription card span full width */
  }

  .dashboard-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .card-header {
    padding: 1.5rem 1.5rem 0 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .view-all {
    color: #6366f1;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .view-all:hover {
    text-decoration: underline;
  }

  .activities-list,
  .lessons-list {
    padding: 1.5rem;
  }

  .activity-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .activity-item:last-child {
    border-bottom: none;
  }

  .activity-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .subject-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
  }

  .subject-badge.mathematik {
    background: #3b82f6;
  }
  .subject-badge.physik {
    background: #10b981;
  }
  .subject-badge.chemie {
    background: #f59e0b;
  }
  .subject-badge.deutsch {
    background: #8b5cf6;
  }

  .activity-details h4 {
    margin: 0 0 0.25rem 0;
    color: #1f2937;
    font-size: 0.875rem;
  }

  .time {
    color: #6b7280;
    font-size: 0.75rem;
  }

  .progress-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6366f1;
  }

  .lesson-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .lesson-item:last-child {
    border-bottom: none;
  }

  .lesson-time {
    font-weight: 600;
    color: #6366f1;
    font-size: 0.875rem;
    min-width: 80px;
  }

  .lesson-content {
    flex: 1;
  }

  .lesson-content h4 {
    margin: 0 0 0.25rem 0;
    color: #1f2937;
    font-size: 0.875rem;
  }

  .lesson-meta {
    display: flex;
    gap: 0.5rem;
  }

  .lesson-meta .subject {
    color: #6b7280;
    font-size: 0.75rem;
  }

  .difficulty {
    padding: 0.125rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
  }

  .difficulty.leicht {
    background: #dcfce7;
    color: #166534;
  }
  .difficulty.mittel {
    background: #fef3c7;
    color: #92400e;
  }
  .difficulty.schwer {
    background: #fee2e2;
    color: #991b1b;
  }

  .quick-actions {
    grid-column: 1 / -1;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1.5rem;
  }

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem 1rem;
    background: #f8fafc;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #374151;
  }

  .action-btn:hover {
    background: #f3f4f6;
    border-color: #6366f1;
    color: #6366f1;
    transform: translateY(-2px);
  }

  .action-btn svg {
    color: currentColor;
  }

  .action-btn span {
    font-weight: 600;
    font-size: 0.875rem;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }

    .quick-actions {
      grid-column: 1;
    }
  }

  @media (max-width: 768px) {
    .dashboard {
      padding: 1rem;
    }

    .dashboard-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .actions-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    .activity-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
</style>
