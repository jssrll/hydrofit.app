// ========================================
// HYDROFIT - ENVIRONMENT CONFIG
// ========================================

const ENV = {
  // Set to 'production' to enable security features
  MODE: 'production',
  
  // API Configuration
  API_URL: 'https://script.google.com/macros/s/AKfycbxl-5SWDIWaAqMGi7EshNIGQamvtDv5rYrIVz0YEj7uKizAlBi3BcYcSObV5LU4Jb2Pbg/exec',
  
  // Feature flags
  FEATURES: {
    DEBUG_MODE: false,
    ENABLE_CONSOLE_LOGS: false,
    ENCRYPT_STORAGE: true
  }
};

// Freeze the object to prevent modifications
Object.freeze(ENV);
Object.freeze(ENV.FEATURES);