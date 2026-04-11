// ========================================
// HYDROFIT - SECURITY & PRIVACY (FIXED)
// ========================================

(function() {
  'use strict';
  
  // ========================================
  // CONFIGURATION
  // ========================================
  const isProduction = true;
  
  // ========================================
  // DISABLE CONSOLE LOGS IN PRODUCTION
  // ========================================
  if (isProduction) {
    // Store original console methods
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug
    };
    
    // Override console methods silently
    console.log = function() {};
    console.warn = function() {};
    console.info = function() {};
    console.debug = function() {};
    
    // Keep error logging for critical issues only
    console.error = function(...args) {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('CRITICAL')) {
        originalConsole.error.apply(console, args);
      }
    };
  }
  
  // ========================================
  // PROTECT SENSITIVE DATA IN LOCALSTORAGE
  // ========================================
  const originalSetItem = localStorage.setItem;
  const originalGetItem = localStorage.getItem;
  
  const encryptKey = 'HydroFit_Secure_2026';
  
  function simpleEncrypt(data) {
    if (typeof data !== 'string') return data;
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(data.charCodeAt(i) ^ encryptKey.charCodeAt(i % encryptKey.length));
    }
    return btoa(encrypted);
  }
  
  function simpleDecrypt(encrypted) {
    if (typeof encrypted !== 'string') return encrypted;
    try {
      const decoded = atob(encrypted);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ encryptKey.charCodeAt(i % encryptKey.length));
      }
      return decrypted;
    } catch(e) {
      return encrypted;
    }
  }
  
  // Override localStorage to encrypt sensitive data
  localStorage.setItem = function(key, value) {
    if (key.includes('user') || key.includes('hydrofit') || key.includes('token')) {
      value = simpleEncrypt(value);
    }
    originalSetItem.call(localStorage, key, value);
  };
  
  localStorage.getItem = function(key) {
    let value = originalGetItem.call(localStorage, key);
    if (value && (key.includes('user') || key.includes('hydrofit') || key.includes('token'))) {
      try {
        value = simpleDecrypt(value);
      } catch(e) {}
    }
    return value;
  };
  
  // ========================================
  // CLEAR CONSOLE ON PAGE LOAD
  // ========================================
  if (isProduction) {
    setTimeout(() => {
      console.clear();
    }, 200);
  }
  
})();