// config.js - HYDROFIT Configuration
const CONFIG = {
  // REPLACE WITH YOUR ACTUAL APPS SCRIPT URL
  API_URL: 'https://script.google.com/macros/s/AKfycbzvhpPOSs2_T4g_DXoNoHDdpxkSjmxIfo6B0LN5VQiNsRfr2IjyHyK-dvxdQKHYHcnefg/exec',
  
  APP_VERSION: '2.0.0',
  POINTS_PER_WORKOUT: 50,
  LEVEL_UP_BASE: 500
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}