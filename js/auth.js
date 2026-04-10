// ========================================
// HYDROFIT - AUTHENTICATION
// ========================================

async function initAuth() {
  const stored = localStorage.getItem("hydrofit_user");
  if (stored) {
    try {
      window.currentUser = JSON.parse(stored);
      document.getElementById("authModal").style.display = "none";
      updateUserStats();
      if (typeof switchTab === 'function') switchTab('dashboard');
    } catch(e) { 
      localStorage.removeItem("hydrofit_user"); 
    }
  }
}

function setupAuthListeners() {
  document.getElementById("loginBtn")?.addEventListener("click", async (e) => {
    const btn = e.target;
    const schoolId = document.getElementById("loginSchoolId").value.trim();
    const password = document.getElementById("loginPassword").value;
    
    if (!schoolId || !password) { 
      showToast("Please enter School ID and Password", true); 
      return; 
    }
    
    const originalText = btn.innerHTML;
    btn.disabled = true; 
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    const result = await callAPI("login", { schoolId, password });
    
    btn.disabled = false; 
    btn.innerHTML = originalText;
    
    if (result.success) {
      window.currentUser = result.user;
      localStorage.setItem("hydrofit_user", JSON.stringify(window.currentUser));
      document.getElementById("authModal").style.display = "none";
      updateUserStats();
      if (typeof switchTab === 'function') switchTab('dashboard');
      showToast(`Welcome, ${window.currentUser.fullName.split(',')[0]}!`, false);
    } else { 
      showToast(result.error || "Invalid credentials", true); 
    }
  });

  document.getElementById("registerBtn")?.addEventListener("click", async (e) => {
    const btn = e.target;
    const fullName = document.getElementById("regFullName").value.trim();
    const schoolId = document.getElementById("regSchoolId").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const program = document.getElementById("regProgram").value;
    const yearLevel = document.getElementById("regYearLevel").value;
    const section = document.getElementById("regSection").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirmPassword").value;
    
    if (!fullName || !schoolId || !email || !program || !yearLevel || !section || !password) { 
      showToast("All fields required", true); 
      return; 
    }
    if (password !== confirm) { 
      showToast("Passwords don't match", true); 
      return; 
    }
    
    const originalText = btn.innerHTML;
    btn.disabled = true; 
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    
    const result = await callAPI("register", { fullName, schoolId, email, program, yearLevel, section, password });
    
    btn.disabled = false; 
    btn.innerHTML = originalText;
    
    if (result.success) {
      showToast("Registration successful! Please login.", false);
      document.getElementById("registerForm").style.display = "none";
      document.getElementById("loginForm").style.display = "block";
      document.getElementById("loginSchoolId").value = schoolId;
    } else { 
      showToast(result.error || "Registration failed", true); 
    }
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("hydrofit_user");
    window.currentUser = null;
    document.getElementById("authModal").style.display = "flex";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginSchoolId").value = "";
    document.getElementById("loginPassword").value = "";
    closeSidebar();
    showToast("Logged out", false);
  });

  document.getElementById("showRegister")?.addEventListener("click", () => {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
  });

  document.getElementById("showLogin")?.addEventListener("click", () => {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  });
}

console.log("✅ Auth Loaded");