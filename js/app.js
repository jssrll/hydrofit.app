// ========================================
// HYDROFIT - MAIN APPLICATION
// ========================================

window.currentUser = null;
window.isLoading = false;
let currentTab = "dashboard";

// Tab Switching
function switchTab(tab) {
  if (window.isLoading) return;
  window.isLoading = true;
  currentTab = tab;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tab) btn.classList.add('active');
  });
  
  closeSidebar();
  
  const actions = {
    'dashboard': () => { updatePageTitle('Dashboard'); renderDashboard(); window.isLoading = false; },
    'profile': () => { updatePageTitle('My Profile'); renderProfile().then(() => window.isLoading = false); return true; },
    'assignment': () => { updatePageTitle('Fitness Assessment'); renderAssignment(); window.isLoading = false; },
    'timer': () => { updatePageTitle('Exercise Timer'); renderTimer(); window.isLoading = false; },
    'bmi': () => { updatePageTitle('BMI Tracker'); renderBMI(); window.isLoading = false; },
    'heartrate': () => { updatePageTitle('Heart Rate Logger'); renderHeartRate(); window.isLoading = false; },
    'movement': () => { updatePageTitle('Movement Library'); renderMovementLibrary(); window.isLoading = false; },
    'injury': () => { updatePageTitle('Injury Prevention'); renderInjuryGuide(); window.isLoading = false; },
    'recovery': () => { updatePageTitle('Recovery Tracker'); renderRecoveryTracker(); window.isLoading = false; },
    'ranking': () => { updatePageTitle('Ranking'); renderRanking(); window.isLoading = false; }
  };
  
  const result = actions[tab]();
  if (result === true) return;
}

// Event Listeners
function setupEventListeners() {
  document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
    if (window.innerWidth <= 768) {
      if (sidebar.classList.contains("open")) {
        const overlay = document.createElement('div');
        overlay.id = 'sidebarOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:199';
        overlay.addEventListener('click', closeSidebar);
        document.body.appendChild(overlay);
      } else { document.getElementById("sidebarOverlay")?.remove(); }
    }
  });

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      const sidebar = document.getElementById("sidebar");
      const menuBtn = document.getElementById("mobileMenuBtn");
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) closeSidebar();
    }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });
}

// Initialize
function init() {
  setupAuthListeners();
  setupEventListeners();
  initAuth();
  console.log("✅ HydroFit Initialized");
}

// Start app
init();