// ========================================
// HYDROFIT - API CALLS
// ========================================

async function callAPI(action, data = {}) {
  try {
    const params = new URLSearchParams({ action, ...data });
    const url = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch(error) {
    console.error("API Error:", error);
    return { success: false, error: error.message };
  }
}

console.log("✅ API Loaded");