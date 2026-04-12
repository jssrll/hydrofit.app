// ========================================
// HYDROFIT - API CALLS
// ========================================

async function callAPI(action, data = {}) {
  try {
    const params = new URLSearchParams({ action, ...data });
    const url = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    console.log("API Call:", action, data); // Debug log
    
    const response = await fetch(url);
    const result = await response.json();
    console.log("API Response:", result); // Debug log
    return result;
  } catch(error) {
    console.error("API Error:", error);
    return { success: false, error: error.message };
  }
}

console.log("✅ API Loaded");