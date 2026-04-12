// ========================================
// HYDROFIT - DRIVE RESOURCES LIBRARY
// ========================================

const driveResources = [
  {
    id: 'pathfitV1',
    fileId: '1XJzF2XYVZaG-wGTs0Li1pvjrWBZNX63B',
    title: 'PATHFit - Physical Fitness',
    description: 'University of Rizal System - Worktext in Physical Fitness and Movement Enhancement',
    author: 'Prof. Noel P. Aranda, Prof. Donna B. Barredo, Prof. Jackilyn Kate A. Mayorca',
    pages: 154,
    color: '#00b4d8',
    icon: '📘'
  },
  {
    id: 'pathfitV2',
    fileId: '1V5AeErJ_m5KJN2h7nrL-Je0V0cc-XhKG',
    title: 'PATHFit - Movement Competency Training',
    description: 'Don Honorio Ventura State University - Physical Activity Towards Health and Fitness 1',
    author: 'DHVSU Mexico Campus',
    pages: 70,
    color: '#00b894',
    icon: '📗'
  },
  {
    id: 'pathfitV3',
    fileId: '1A1cRh5WuprmTq7sLLf3mPWtAcFLZNH2u',
    title: 'PATHFit - Movement Competency Training',
    description: 'Polytechnic University of the Philippines - Instructional Materials for PATHFit 1',
    author: 'Rhene A. Camarador, Janvier B. Mantala, et al.',
    pages: 114,
    color: '#e17055',
    icon: '📙'
  },
  {
    id: 'pathfitV4',
    fileId: '18O_pPX2v3zpnRPN667zMlgPgDMY4pqYr',
    title: 'PATHFit - Movement Enhancement',
    description: 'Political Science 601 - Physical Education Module 1',
    author: 'Movement Enhancement Module',
    pages: 22,
    color: '#6c5ce7',
    icon: '📕'
  }
];

let currentResource = driveResources[0];
let currentPage = 1;

function renderDriveResources() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Drive Resources" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Resource Cards -->
    <div class="card">
      <h3><i class="fab fa-google-drive"></i> PATHFit Learning Modules</h3>
      <p style="color:#64748b;margin-bottom:20px">Access all your Physical Education course materials in one place</p>
      
      <div class="resource-cards">
        ${driveResources.map(resource => `
          <div class="resource-card ${currentResource.id === resource.id ? 'active' : ''}" 
               onclick="selectResource('${resource.id}')"
               style="border-left: 4px solid ${resource.color}">
            <div class="resource-icon" style="background: ${resource.color}20">${resource.icon}</div>
            <div class="resource-info">
              <h4>${resource.title}</h4>
              <p class="resource-author"><i class="fas fa-user-graduate"></i> ${resource.author}</p>
              <p class="resource-desc">${resource.description}</p>
              <div class="resource-meta">
                <span><i class="fas fa-file-pdf"></i> PDF Document</span>
                <span><i class="fas fa-layer-group"></i> ${resource.pages} pages</span>
              </div>
            </div>
            <div class="resource-badge" style="background: ${resource.color}">
              ${resource.pages} pgs
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Live PDF Viewer -->
    <div class="card viewer-card">
      <div class="viewer-header">
        <div>
          <h3><i class="fas fa-eye"></i> <span id="currentResourceTitle">${currentResource.title}</span></h3>
          <p style="color:#64748b" id="currentResourceAuthor">${currentResource.author}</p>
        </div>
        <div class="viewer-actions">
          <button class="viewer-btn" onclick="openInNewTab()" title="Open in new tab">
            <i class="fas fa-external-link-alt"></i>
          </button>
          <button class="viewer-btn" onclick="downloadPDF()" title="Download PDF">
            <i class="fas fa-download"></i>
          </button>
          <button class="viewer-btn" onclick="copyPDFLink()" title="Copy link">
            <i class="fas fa-link"></i>
          </button>
          <button class="viewer-btn" onclick="toggleFullscreen()" title="Fullscreen">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
      
      <!-- PDF Viewer -->
      <div class="pdf-viewer-container" id="pdfViewerContainer">
        <iframe 
          id="pdfViewer"
          src="https://drive.google.com/file/d/${currentResource.fileId}/preview"
          width="100%"
          height="700"
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>
      
      <div class="viewer-footer">
        <p><i class="fas fa-sync-alt"></i> Live document - updates automatically</p>
        <p><i class="fas fa-mouse"></i> Scroll to navigate • Click to zoom</p>
      </div>
    </div>

    <!-- Quick Navigation -->
    <div class="card quick-nav-card">
      <h3><i class="fas fa-compass"></i> Quick Navigation</h3>
      <div class="quick-nav-grid">
        ${driveResources.map(resource => `
          <div class="quick-nav-item" onclick="selectResource('${resource.id}')">
            <div class="nav-icon" style="background: ${resource.color}">${resource.icon}</div>
            <span>${resource.title}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Resource Details -->
    <div class="card details-card">
      <h3><i class="fas fa-info-circle"></i> About This Module</h3>
      <div id="resourceDetails">
        <div class="details-grid">
          <div class="detail-item">
            <i class="fas fa-book"></i>
            <div>
              <label>Title</label>
              <p>${currentResource.title}</p>
            </div>
          </div>
          <div class="detail-item">
            <i class="fas fa-user"></i>
            <div>
              <label>Author(s)</label>
              <p>${currentResource.author}</p>
            </div>
          </div>
          <div class="detail-item">
            <i class="fas fa-file-alt"></i>
            <div>
              <label>Pages</label>
              <p>${currentResource.pages} pages</p>
            </div>
          </div>
          <div class="detail-item">
            <i class="fas fa-building"></i>
            <div>
              <label>Institution</label>
              <p>${getInstitution(currentResource.id)}</p>
            </div>
          </div>
        </div>
        <p class="detail-description">${currentResource.description}</p>
      </div>
    </div>
  `;
}

function getInstitution(id) {
  const institutions = {
    pathfitV1: 'University of Rizal System',
    pathfitV2: 'Don Honorio Ventura State University',
    pathfitV3: 'Polytechnic University of the Philippines',
    pathfitV4: 'Movement Enhancement Module'
  };
  return institutions[id] || 'PATHFit Program';
}

function selectResource(resourceId) {
  currentResource = driveResources.find(r => r.id === resourceId);
  
  // Update viewer
  const viewer = document.getElementById('pdfViewer');
  viewer.src = `https://drive.google.com/file/d/${currentResource.fileId}/preview`;
  
  // Update title and author
  document.getElementById('currentResourceTitle').innerText = currentResource.title;
  document.getElementById('currentResourceAuthor').innerText = currentResource.author;
  
  // Update active card
  document.querySelectorAll('.resource-card').forEach(card => {
    card.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  
  // Update details section
  updateResourceDetails();
  
  showToast(`Loading ${currentResource.title}... 📚`, false);
}

function updateResourceDetails() {
  const detailsDiv = document.getElementById('resourceDetails');
  detailsDiv.innerHTML = `
    <div class="details-grid">
      <div class="detail-item">
        <i class="fas fa-book"></i>
        <div>
          <label>Title</label>
          <p>${currentResource.title}</p>
        </div>
      </div>
      <div class="detail-item">
        <i class="fas fa-user"></i>
        <div>
          <label>Author(s)</label>
          <p>${currentResource.author}</p>
        </div>
      </div>
      <div class="detail-item">
        <i class="fas fa-file-alt"></i>
        <div>
          <label>Pages</label>
          <p>${currentResource.pages} pages</p>
        </div>
      </div>
      <div class="detail-item">
        <i class="fas fa-building"></i>
        <div>
          <label>Institution</label>
          <p>${getInstitution(currentResource.id)}</p>
        </div>
      </div>
    </div>
    <p class="detail-description">${currentResource.description}</p>
  `;
}

function openInNewTab() {
  window.open(`https://drive.google.com/file/d/${currentResource.fileId}/view`, '_blank');
}

function downloadPDF() {
  window.open(`https://drive.google.com/uc?export=download&id=${currentResource.fileId}`, '_blank');
  showToast('Downloading PDF... 📥', false);
}

function copyPDFLink() {
  const link = `https://drive.google.com/file/d/${currentResource.fileId}/view`;
  navigator.clipboard.writeText(link).then(() => {
    showToast('Link copied to clipboard! 📋', false);
  });
}

function toggleFullscreen() {
  const viewer = document.getElementById('pdfViewerContainer');
  if (viewer.requestFullscreen) {
    viewer.requestFullscreen();
  }
}

console.log("✅ Drive Resources Loaded");