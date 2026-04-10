// ========================================
// HYDROFIT - PROFILE & QR CODE
// ========================================

function generateQRCodeSVG(userData) {
  const qrData = JSON.stringify({
    name: userData.fullName,
    schoolId: userData.schoolId,
    email: userData.email,
    program: userData.program,
    yearLevel: userData.yearLevel,
    section: userData.section
  });
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=000000&format=png`;
}

function generateQRCodeCanvas(userData, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = 250;
  canvas.height = 250;
  const ctx = canvas.getContext('2d');
  
  const dataStr = userData.schoolId + userData.fullName;
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {
    hash = ((hash << 5) - hash) + dataStr.charCodeAt(i);
    hash = hash & hash;
  }
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 250, 250);
  ctx.fillStyle = '#000000';
  
  ctx.fillRect(0, 0, 70, 70);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(10, 10, 50, 50);
  ctx.fillStyle = '#000000';
  ctx.fillRect(20, 20, 30, 30);
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(180, 0, 70, 70);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(190, 10, 50, 50);
  ctx.fillStyle = '#000000';
  ctx.fillRect(200, 20, 30, 30);
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 180, 70, 70);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(10, 190, 50, 50);
  ctx.fillStyle = '#000000';
  ctx.fillRect(20, 200, 30, 30);
  
  const cellSize = 10;
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      if ((i < 7 && j < 7) || (i > 17 && j < 7) || (i < 7 && j > 17)) continue;
      const value = (hash >> (i * j) % 32) & 1;
      if (value) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }
  
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText(userData.schoolId, 125, 240);
  
  container.innerHTML = '';
  container.appendChild(canvas);
  window.qrCanvas = canvas;
}

function downloadQRCode() {
  if (window.qrCanvas) {
    const link = document.createElement('a');
    link.download = `HydroFit_QR_${window.currentUser.schoolId}.png`;
    link.href = window.qrCanvas.toDataURL('image/png');
    link.click();
    showToast('QR Code downloaded!', false);
  } else if (window.currentQRCodeUrl) {
    fetch(window.currentQRCodeUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `HydroFit_QR_${window.currentUser.schoolId}.png`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('QR Code downloaded!', false);
      })
      .catch(() => {
        window.open(window.currentQRCodeUrl, '_blank');
        showToast('Right-click to save', false);
      });
  }
}

function printQRCode() {
  const qrContainer = document.querySelector('.qr-container');
  if (!qrContainer) return;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html><head><title>HydroFit QR - ${window.currentUser.fullName}</title>
    <style>body{font-family:Inter,sans-serif;text-align:center;padding:40px}img,canvas{width:250px;height:250px}</style></head>
    <body><div style="max-width:400px;margin:0 auto"><h2>HydroFit Attendance QR</h2>${qrContainer.innerHTML}
    <p><strong>${escapeHtml(window.currentUser.fullName)}</strong></p><p>ID: ${window.currentUser.schoolId}</p></div></body></html>
  `);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
}

async function renderProfile() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading profile...</div>`;
  
  let userData = window.currentUser;
  if (!userData || !userData.schoolId) {
    const result = await callAPI("getProfile", { schoolId: window.currentUser?.schoolId });
    if (result.success) { 
      userData = result.user; 
      window.currentUser = userData; 
      localStorage.setItem("hydrofit_user", JSON.stringify(window.currentUser)); 
    }
  }
  
  if (!userData) { 
    container.innerHTML = `<div class="card"><p style="color:#d63031">Error loading profile</p></div>`; 
    window.isLoading = false; 
    return; 
  }
  
  const programColors = {'BSIT':'#00b4d8','BSED':'#48cae4','BSHM':'#90e0ef','BSTM':'#00b894','BS PSYCHOLOGY':'#fdcb6e','BSCRIM':'#e17055','BTLED':'#6c5ce7','BTVTED':'#a29bfe'};
  const qrCodeUrl = generateQRCodeSVG(userData);
  window.currentQRCodeUrl = qrCodeUrl;
  
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar"><i class="fas fa-user-graduate"></i></div>
      <h2>${escapeHtml(userData.fullName)}</h2><p>PathFit Student</p>
      <span class="program-badge" style="background:${programColors[userData.program]||'#00b4d8'};color:white">${userData.program}</span>
      <div class="profile-info-grid">
        <div class="info-item"><label>School ID</label><p>${userData.schoolId}</p></div>
        <div class="info-item"><label>Email</label><p>${userData.email}</p></div>
        <div class="info-item"><label>Year Level</label><p>${userData.yearLevel}${getYearSuffix(userData.yearLevel)} Year</p></div>
        <div class="info-item"><label>Section</label><p>${userData.section}</p></div>
      </div>
    </div>
    <div class="card qr-card">
      <h3><i class="fas fa-qrcode"></i> Attendance QR Code</h3>
      <p style="color:#64748b;margin-bottom:20px">Scan for attendance tracking</p>
      <div style="text-align:center">
        <div class="qr-container" style="background:white;padding:20px;border-radius:16px;display:inline-block;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
          <img src="${qrCodeUrl}" alt="QR Code" style="width:200px;height:200px;display:block" id="qrImage" onerror="this.onerror=null;generateQRCodeCanvas(window.currentUser,'qrCanvasContainer');this.style.display='none';document.getElementById('qrCanvasContainer').style.display='block'">
          <div id="qrCanvasContainer" style="display:none"></div>
        </div>
        <p style="margin-top:16px"><i class="fas fa-user"></i> ${escapeHtml(userData.fullName)}</p>
        <p style="color:#64748b"><i class="fas fa-id-card"></i> ${userData.schoolId}</p>
        <button class="btn btn-outline" onclick="downloadQRCode()" style="margin-top:16px;width:100%"><i class="fas fa-download"></i> Download</button>
        <button class="btn btn-outline" onclick="printQRCode()" style="margin-top:8px;width:100%"><i class="fas fa-print"></i> Print</button>
      </div>
    </div>
  `;
}

console.log("✅ Profile Loaded");