// ========================================
// HYDROFIT - CONFIGURATION
// ========================================

// Use environment API URL if available
const GOOGLE_SCRIPT_URL = (typeof ENV !== 'undefined' && ENV.API_URL) 
  ? ENV.API_URL 
  : "https://script.google.com/macros/s/AKfycbxJIaGkcfxPQLrj8krrsTvpbrwBqnFaWwrB_pUT-I-EwN1_7rTmLjir9STSVQG8GWxKjA/exec";

// Production mode check
const IS_PRODUCTION = (typeof ENV !== 'undefined') ? ENV.MODE === 'production' : true;

console.log("✅ HydroFit Config Loaded");