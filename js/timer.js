// ========================================
// HYDROFIT - EXERCISE TIMER
// ========================================

let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let timerMode = 'stopwatch';
let audioContext = null;
let intervalRunning = false;
let intervalTimeout = null;
let intervalData = { work: 30, rest: 15, rounds: 5 };
let currentRound = 0;
let currentPhase = 'work';
let intervalSeconds = 0;

function playRingSound() {
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    
    const now = audioContext.currentTime;
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc1.type = 'sine'; osc1.frequency.value = 880;
    osc2.type = 'sine'; osc2.frequency.value = 1108;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2);
    
    osc1.connect(gainNode); osc2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc1.start(); osc2.start();
    osc1.stop(now + 2); osc2.stop(now + 2);
    
    setTimeout(() => {
      if (audioContext) {
        const now2 = audioContext.currentTime;
        const osc3 = audioContext.createOscillator();
        const osc4 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc3.type = 'sine'; osc3.frequency.value = 880;
        osc4.type = 'sine'; osc4.frequency.value = 1108;
        gain2.gain.setValueAtTime(0.3, now2);
        gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 2);
        osc3.connect(gain2); osc4.connect(gain2);
        gain2.connect(audioContext.destination);
        osc3.start(); osc4.start();
        osc3.stop(now2 + 2); osc4.stop(now2 + 2);
      }
    }, 500);
  } catch (e) { console.log('Audio failed:', e); }
}

function renderTimer() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `
    <div class="timer-banner"><img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Timer Banner" style="width:100%;border-radius:20px;box-shadow:var(--shadow)"></div>
    <div class="card"><h3><i class="fas fa-clock"></i> Exercise Timer</h3><p style="color:#64748b;margin-bottom:20px">Focus on timing and intervals</p>
      <div class="timer-mode-selector">
        <button class="timer-mode-btn ${timerMode==='stopwatch'?'active':''}" onclick="setTimerMode('stopwatch')"><i class="fas fa-stopwatch"></i> Stopwatch</button>
        <button class="timer-mode-btn ${timerMode==='timer'?'active':''}" onclick="setTimerMode('timer')"><i class="fas fa-hourglass-half"></i> Countdown</button>
      </div>
      <div class="timer-display-large" id="timerDisplay">00:00:00</div>
      <div id="timerSettings" style="display:${timerMode==='timer'?'block':'none'}">
        <div class="timer-inputs">
          <div class="timer-input-group"><label>Hours</label><input type="number" id="timerHours" min="0" max="23" value="0" class="timer-input"></div>
          <div class="timer-input-group"><label>Minutes</label><input type="number" id="timerMinutes" min="0" max="59" value="1" class="timer-input"></div>
          <div class="timer-input-group"><label>Seconds</label><input type="number" id="timerSeconds" min="0" max="59" value="0" class="timer-input"></div>
        </div>
        <button class="btn" onclick="setCountdownTime()" style="width:100%"><i class="fas fa-check"></i> Set Time</button>
      </div>
      <div class="timer-controls">
        <button class="timer-control-btn btn-success" id="startBtn" onclick="startTimer()"><i class="fas fa-play"></i> Start</button>
        <button class="timer-control-btn btn-warning" id="pauseBtn" onclick="pauseTimer()" style="display:none"><i class="fas fa-pause"></i> Pause</button>
        <button class="timer-control-btn btn-danger" onclick="resetTimer()"><i class="fas fa-undo-alt"></i> Reset</button>
      </div>
    </div>
    <div class="card"><h3><i class="fas fa-repeat"></i> Interval Training</h3>
      <div class="interval-settings">
        <div class="interval-row"><label>Work (s)</label><input type="number" id="workInterval" min="1" max="300" value="30" class="form-control"></div>
        <div class="interval-row"><label>Rest (s)</label><input type="number" id="restInterval" min="1" max="300" value="15" class="form-control"></div>
        <div class="interval-row"><label>Rounds</label><input type="number" id="rounds" min="1" max="50" value="5" class="form-control"></div>
      </div>
      <div id="intervalDisplay" style="text-align:center;padding:20px;background:#f0f9ff;border-radius:16px;margin:16px 0">
        <div style="font-size:1.2rem;font-weight:600;color:var(--primary)" id="intervalPhase">Ready</div>
        <div style="font-size:2.5rem;font-weight:800;color:var(--darker)" id="intervalTime">30</div>
        <div style="color:#64748b" id="intervalRound">Round 0/5</div>
      </div>
      <button class="btn" onclick="startInterval()" style="width:100%" id="startIntervalBtn"><i class="fas fa-play"></i> Start Interval</button>
      <button class="btn btn-outline" onclick="stopInterval()" style="width:100%;margin-top:8px;display:none" id="stopIntervalBtn"><i class="fas fa-stop"></i> Stop</button>
    </div>
    <div class="card"><h3><i class="fas fa-bolt"></i> Quick Timers</h3>
      <div class="quick-timers">
        <button class="quick-timer-btn" onclick="quickTimer(30)">30s</button><button class="quick-timer-btn" onclick="quickTimer(60)">1m</button>
        <button class="quick-timer-btn" onclick="quickTimer(90)">90s</button><button class="quick-timer-btn" onclick="quickTimer(120)">2m</button>
        <button class="quick-timer-btn" onclick="quickTimer(300)">5m</button><button class="quick-timer-btn" onclick="quickTimer(600)">10m</button>
      </div>
    </div>
  `;
}

function setTimerMode(mode) { timerMode = mode; pauseTimer(); resetTimer(); renderTimer(); }
function setCountdownTime() { const h=parseInt(document.getElementById('timerHours').value)||0; const m=parseInt(document.getElementById('timerMinutes').value)||0; const s=parseInt(document.getElementById('timerSeconds').value)||0; timerSeconds=h*3600+m*60+s; updateTimerDisplay(); }
function startTimer() { if(timerRunning)return; if(timerMode==='timer'&&timerSeconds===0){setCountdownTime();if(timerSeconds===0){showToast('Set a time',true);return;}} timerRunning=true; document.getElementById('startBtn').style.display='none'; document.getElementById('pauseBtn').style.display='inline-block'; timerInterval=setInterval(()=>{if(timerMode==='stopwatch')timerSeconds++;else{if(timerSeconds>0)timerSeconds--;if(timerSeconds===0){pauseTimer();playRingSound();showToast("Time's up!",false);}} updateTimerDisplay();},1000); }
function pauseTimer() { timerRunning=false; clearInterval(timerInterval); document.getElementById('startBtn').style.display='inline-block'; document.getElementById('pauseBtn').style.display='none'; }
function resetTimer() { pauseTimer(); timerSeconds=0; updateTimerDisplay(); }
function updateTimerDisplay() { const h=Math.floor(timerSeconds/3600); const m=Math.floor((timerSeconds%3600)/60); const s=timerSeconds%60; document.getElementById('timerDisplay').innerText=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
function quickTimer(s) { setTimerMode('timer'); timerSeconds=s; updateTimerDisplay(); startTimer(); }

function startInterval() {
  intervalData.work=parseInt(document.getElementById('workInterval').value)||30;
  intervalData.rest=parseInt(document.getElementById('restInterval').value)||15;
  intervalData.rounds=parseInt(document.getElementById('rounds').value)||5;
  currentRound=1; currentPhase='work'; intervalSeconds=intervalData.work; intervalRunning=true;
  document.getElementById('startIntervalBtn').style.display='none';
  document.getElementById('stopIntervalBtn').style.display='block';
  updateIntervalDisplay(); runInterval();
}
function runInterval() { if(!intervalRunning)return; intervalTimeout=setInterval(()=>{ intervalSeconds--; if(intervalSeconds<=0){ playRingSound(); if(currentPhase==='work'){ if(currentRound<intervalData.rounds){ currentPhase='rest'; intervalSeconds=intervalData.rest; }else{ stopInterval(); showToast('Complete!',false); return; } }else{ currentRound++; currentPhase='work'; intervalSeconds=intervalData.work; } } updateIntervalDisplay(); },1000); }
function updateIntervalDisplay() { document.getElementById('intervalPhase').innerText=currentPhase==='work'?'💪 WORK':'😌 REST'; document.getElementById('intervalTime').innerText=intervalSeconds; document.getElementById('intervalRound').innerText=`Round ${currentRound}/${intervalData.rounds}`; }
function stopInterval() { intervalRunning=false; clearInterval(intervalTimeout); document.getElementById('startIntervalBtn').style.display='block'; document.getElementById('stopIntervalBtn').style.display='none'; document.getElementById('intervalPhase').innerText='Ready'; document.getElementById('intervalTime').innerText=intervalData.work; document.getElementById('intervalRound').innerText=`Round 0/${intervalData.rounds}`; }

console.log("✅ Timer Loaded");