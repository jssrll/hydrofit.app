// sheets-integration.js - Complete Google Sheets API Integration
let apiUrl = null;

function initSheetDB(apiUrlParam) {
  apiUrl = apiUrlParam;
  console.log('✅ API Ready:', apiUrl);
  return { isReady: true };
}

// JSONP request (bypasses CORS)
function jsonpRequest(url, callback) {
  const callbackName = 'jsonp_cb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
  
  window[callbackName] = function(data) {
    delete window[callbackName];
    if (script.parentNode) document.body.removeChild(script);
    callback(data);
  };
  
  const separator = url.includes('?') ? '&' : '?';
  const script = document.createElement('script');
  script.src = `${url}${separator}callback=${callbackName}`;
  script.onerror = function() {
    delete window[callbackName];
    document.body.removeChild(script);
    callback({ success: false, error: 'Network error' });
  };
  
  document.body.appendChild(script);
  
  // Timeout
  setTimeout(() => {
    if (window[callbackName]) {
      delete window[callbackName];
      if (script.parentNode) document.body.removeChild(script);
      callback({ success: false, error: 'Request timeout' });
    }
  }, 15000);
}

async function registerUser(userData) {
  return new Promise((resolve) => {
    const url = `${apiUrl}?action=register&fullName=${encodeURIComponent(userData.fullName)}&schoolId=${encodeURIComponent(userData.schoolId)}&program=${encodeURIComponent(userData.program)}&subject=${encodeURIComponent(userData.subject || 'Pathfit')}&password=${encodeURIComponent(userData.password)}`;
    
    jsonpRequest(url, (result) => {
      resolve(result);
    });
  });
}

async function loginUser(schoolId, password) {
  return new Promise((resolve) => {
    const url = `${apiUrl}?action=login&schoolId=${encodeURIComponent(schoolId)}&password=${encodeURIComponent(password)}`;
    
    jsonpRequest(url, (result) => {
      resolve(result);
    });
  });
}

// Test API connection
async function testAPIConnection() {
  return new Promise((resolve) => {
    const url = `${apiUrl}?action=test`;
    jsonpRequest(url, (result) => {
      resolve(result);
    });
  });
}