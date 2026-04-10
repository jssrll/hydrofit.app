// ========================================
// HYDROFIT - UTILITY FUNCTIONS
// ========================================

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  toast.style.background = isError ? "#d63031" : "#03045e";
  toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}" style="margin-right: 8px;"></i> ${message}`;
  setTimeout(() => { toast.style.display = "none"; }, 3000);
}

function updatePageTitle(title) {
  document.getElementById("pageTitle").innerText = title;
}

function updateUserStats() {
  if (window.currentUser) {
    const lastName = window.currentUser.fullName.split(',')[0];
    document.getElementById("userNameDisplay").innerHTML = `<i class="fas fa-user"></i> ${lastName}`;
  }
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.remove();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);
}

function getYearSuffix(year) {
  if (year == 1) return 'st';
  if (year == 2) return 'nd';
  if (year == 3) return 'rd';
  return 'th';
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${secs}s`;
}

console.log("✅ Utils Loaded");