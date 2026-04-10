// ========================================
// HYDROFIT - DASHBOARD
// ========================================

function renderDashboard() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="slideshow-wrapper">
      <div class="slideshow-container" id="slideshowContainer">
        <div class="slide active" style="background-image: url('https://ik.imagekit.io/0sf7uub8b/HydroFit/slides_1.jpg?updatedAt=1775652185255'); background-size: cover; background-position: center;"></div>
        <div class="slide" style="background-image: url('https://ik.imagekit.io/0sf7uub8b/HydroFit/slides_2.jpg?updatedAt=1775652283140'); background-size: cover; background-position: center;"></div>
        <div class="slide" style="background-image: url('https://ik.imagekit.io/0sf7uub8b/HydroFit/slides_3.jpg?updatedAt=1775652127029'); background-size: cover; background-position: center;"></div>
        <div class="slide-dots" id="slideDots"></div>
      </div>
      <div class="slideshow-overlay">
        <div class="school-badge">
          <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/images%20(4).jpg?updatedAt=1775655891511" alt="MinSU Logo">
          <div class="school-text"><strong>Mindoro State University</strong><span>PathFit Class</span></div>
        </div>
      </div>
    </div>
    <div class="welcome-card"><h2>Welcome to HydroFit</h2><p>Your Academic Fitness Tracker for PathFit Class</p></div>
    <div class="card">
      <h3><i class="fas fa-info-circle"></i> About HydroFit</h3>
      <p style="margin-bottom:16px">HydroFit is an academic fitness tracking web application designed specifically for the PathFit program at Mindoro State University. Its purpose is to help students monitor their physical activity, track hydration goals, and stay engaged with their fitness journey throughout the semester.</p>
      <p style="margin-bottom:16px">The platform was created to support the PathFit curriculum by providing a simple and modern digital tool where students can log their progress, view assessments, and check their rankings—all in one place.</p>
      <div class="dev-credits">
        <p><i class="fas fa-users"></i> Developed by:</p>
        <ul><li><i class="fas fa-user-graduate"></i> Jessrell M. Custodio</li><li><i class="fas fa-user-graduate"></i> John Daniel C. Soriano</li><li><i class="fas fa-user-graduate"></i> John Roberth C. Marchina</li></ul>
        <p class="completion-date"><i class="fas fa-calendar-check"></i> Completed April 15, 2026</p>
      </div>
    </div>
  `;
  initSlideshow();
}

function initSlideshow() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slideDots');
  if (!slides.length) return;
  
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });
  
  function goToSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    slides[n].classList.add('active');
    if (document.querySelectorAll('.dot')[n]) document.querySelectorAll('.dot')[n].classList.add('active');
    currentSlide = n;
  }
  
  setInterval(() => { goToSlide((currentSlide + 1) % slides.length); }, 4000);
}

console.log("✅ Dashboard Loaded");