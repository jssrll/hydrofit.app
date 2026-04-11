// ========================================
// HYDROFIT - SECURITY & PRIVACY
// ========================================

(function() {
  'use strict';
  
  // ========================================
  // DISABLE CONSOLE LOGS IN PRODUCTION
  // ========================================
  const isProduction = true; // Set to true to disable logs
  
  if (isProduction) {
    // Store original console methods
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug
    };
    
    // Override console methods
    console.log = function() {};
    console.warn = function() {};
    console.info = function() {};
    console.debug = function() {};
    
    // Keep error logging for debugging critical issues
    console.error = function(...args) {
      // Only show critical errors
      if (args[0] && typeof args[0] === 'string' && args[0].includes('CRITICAL')) {
        originalConsole.error.apply(console, args);
      }
    };
    
    // Prevent access to original console
    Object.defineProperty(window, 'console', {
      value: console,
      writable: false,
      configurable: false
    });
  }
  
  // ========================================
  // PREVENT DEVTOOLS DETECTION
  // ========================================
  setInterval(() => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      // DevTools might be open
      if (isProduction) {
        // Clear sensitive data from console
        console.clear();
      }
    }
  }, 1000);
  
  // ========================================
  // DISABLE RIGHT CLICK (Optional)
  // ========================================
  document.addEventListener('contextmenu', (e) => {
    // Allow right-click on inputs and buttons
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'button') {
      return;
    }
    e.preventDefault();
    return false;
  });
  
  // ========================================
  // DISABLE KEYBOARD SHORTCUTS FOR DEVTOOLS
  // ========================================
  document.addEventListener('keydown', (e) => {
    // Block F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    
    // Block Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    
    // Block Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    
    // Block Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
    
    // Block Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
  });
  
  // ========================================
  // PROTECT SENSITIVE DATA IN LOCALSTORAGE
  // ========================================
  const originalSetItem = localStorage.setItem;
  const originalGetItem = localStorage.getItem;
  
  // Simple encryption for sensitive data
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
    // Encrypt user data
    if (key.includes('user') || key.includes('hydrofit') || key.includes('token')) {
      value = simpleEncrypt(value);
    }
    originalSetItem.call(localStorage, key, value);
  };
  
  localStorage.getItem = function(key) {
    let value = originalGetItem.call(localStorage, key);
    // Decrypt user data
    if (value && (key.includes('user') || key.includes('hydrofit') || key.includes('token'))) {
      try {
        value = simpleDecrypt(value);
      } catch(e) {
        // Return as is if decryption fails
      }
    }
    return value;
  };
  
  // ========================================
  // PREVENT SOURCE CODE VIEWING
  // ========================================
  if (isProduction) {
    // Disable view source attempts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    });
  }
  
  // ========================================
  // CLEAR CONSOLE ON PAGE LOAD
  // ========================================
  if (isProduction) {
    setTimeout(() => {
      console.clear();
    }, 100);
  }
  
  console.log('🔒 Security module loaded');
  
})();