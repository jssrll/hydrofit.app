// ========================================
// HYDROFIT - MOCK DATA
// Dashboard, Profile, Assignment, Ranking
// ========================================

// Sample Users Database (for login simulation)
const usersDB = [
  { 
    id: 1, 
    fullName: "Juan Dela Cruz", 
    phone: "09123456789", 
    password: "student123",
    studentId: "2024-001",
    hydrationPoints: 1250,
    rank: 3,
    avatar: "JD"
  },
  { 
    id: 2, 
    fullName: "Maria Santos", 
    phone: "09987654321", 
    password: "maria123",
    studentId: "2024-002",
    hydrationPoints: 2100,
    rank: 1,
    avatar: "MS"
  },
  { 
    id: 3, 
    fullName: "Jose Rizal", 
    phone: "09771234567", 
    password: "jose123",
    studentId: "2024-003",
    hydrationPoints: 980,
    rank: 5,
    avatar: "JR"
  },
  { 
    id: 4, 
    fullName: "Leonor Rivera", 
    phone: "09665432178", 
    password: "leonor123",
    studentId: "2024-004",
    hydrationPoints: 1850,
    rank: 2,
    avatar: "LR"
  },
  { 
    id: 5, 
    fullName: "Andres Bonifacio", 
    phone: "09554321876", 
    password: "andres123",
    studentId: "2024-005",
    hydrationPoints: 1100,
    rank: 4,
    avatar: "AB"
  }
];

// Dashboard - Hydration Tracking Data
const hydrationData = {
  daily: {
    target: 8,
    current: 5,
    unit: "glasses"
  },
  weekly: [4, 6, 7, 5, 8, 6, 5],
  streak: 12,
  badges: ["Early Bird", "Hydration Hero", "Weekend Warrior"]
};

// Dashboard - Workout Sessions
const workoutSessions = [
  { id: 1, name: "Morning Run", duration: "30 min", calories: 250, completed: true },
  { id: 2, name: "Push-ups", duration: "15 min", calories: 120, completed: true },
  { id: 3, name: "Squats", duration: "20 min", calories: 180, completed: false },
  { id: 4, name: "Plank Challenge", duration: "10 min", calories: 80, completed: false }
];

// Assignments / Academic Fitness Tasks
const assignments = [
  { 
    id: 1, 
    title: "Physical Fitness Test", 
    subject: "PE 101",
    dueDate: "2026-04-15",
    status: "pending",
    description: "Complete the fitness assessment: 10 push-ups, 20 squats, 1-minute plank",
    points: 100
  },
  { 
    id: 2, 
    title: "Hydration Log", 
    subject: "Health Science",
    dueDate: "2026-04-10",
    status: "submitted",
    description: "Track daily water intake for 7 days",
    points: 50
  },
  { 
    id: 3, 
    title: "Step Challenge", 
    subject: "Wellness",
    dueDate: "2026-04-20",
    status: "pending",
    description: "Achieve 10,000 steps daily for 5 days",
    points: 150
  },
  { 
    id: 4, 
    title: "Yoga Session", 
    subject: "Mindfulness",
    dueDate: "2026-04-12",
    status: "completed",
    description: "Complete a 30-minute yoga routine",
    points: 75,
    score: 85
  }
];

// Ranking Data - Class Leaderboard
const classRanking = [
  { rank: 1, name: "Maria Santos", hydrationPoints: 2100, studentId: "2024-002", class: "BSIT-3A" },
  { rank: 2, name: "Leonor Rivera", hydrationPoints: 1850, studentId: "2024-004", class: "BSIT-3A" },
  { rank: 3, name: "Juan Dela Cruz", hydrationPoints: 1250, studentId: "2024-001", class: "BSIT-3A" },
  { rank: 4, name: "Andres Bonifacio", hydrationPoints: 1100, studentId: "2024-005", class: "BSIT-3A" },
  { rank: 5, name: "Jose Rizal", hydrationPoints: 980, studentId: "2024-003", class: "BSIT-3A" },
  { rank: 6, name: "Emilio Aguinaldo", hydrationPoints: 850, studentId: "2024-006", class: "BSIT-3A" },
  { rank: 7, name: "Gabriela Silang", hydrationPoints: 720, studentId: "2024-007", class: "BSIT-3A" },
  { rank: 8, name: "Lapu-Lapu", hydrationPoints: 650, studentId: "2024-008", class: "BSIT-3A" },
  { rank: 9, name: "Melchora Aquino", hydrationPoints: 580, studentId: "2024-009", class: "BSIT-3A" },
  { rank: 10, name: "Antonio Luna", hydrationPoints: 500, studentId: "2024-010", class: "BSIT-3A" }
];

// Section/Class Ranking (Different Sections)
const sectionRanking = [
  { rank: 1, section: "BSIT-3A", averagePoints: 1560, studentCount: 32 },
  { rank: 2, section: "BSIT-3B", averagePoints: 1420, studentCount: 30 },
  { rank: 3, section: "BSCS-3A", averagePoints: 1380, studentCount: 28 },
  { rank: 4, section: "BSIS-3A", averagePoints: 1250, studentCount: 25 },
  { rank: 5, section: "BSIT-3C", averagePoints: 1180, studentCount: 29 }
];

// Current logged in user
let currentUser = null;

// Helper function to get current user data
function getCurrentUser() {
  return currentUser;
}

// Helper function to set current user
function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem("hydrofit_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("hydrofit_user");
  }
}

// Load user from localStorage
function loadStoredUser() {
  const stored = localStorage.getItem("hydrofit_user");
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      return currentUser;
    } catch(e) {
      return null;
    }
  }
  return null;
}

// Update user hydration points
function updateUserHydrationPoints(phone, points) {
  const user = usersDB.find(u => u.phone === phone);
  if (user) {
    user.hydrationPoints += points;
    if (currentUser && currentUser.phone === phone) {
      currentUser.hydrationPoints = user.hydrationPoints;
      setCurrentUser(currentUser);
    }
    return true;
  }
  return false;
}

// Get user by phone and password
function authenticateUser(phone, password) {
  return usersDB.find(u => u.phone === phone && u.password === password);
}

// Get user ranking position
function getUserRank(phone) {
  const sorted = [...classRanking].sort((a, b) => b.hydrationPoints - a.hydrationPoints);
  const index = sorted.findIndex(u => u.phone === phone);
  return index !== -1 ? index + 1 : null;
}

// Export for app.js usage (will be globally available)
window.hydrationData = hydrationData;
window.workoutSessions = workoutSessions;
window.assignments = assignments;
window.classRanking = classRanking;
window.sectionRanking = sectionRanking;
window.usersDB = usersDB;
window.authenticateUser = authenticateUser;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.loadStoredUser = loadStoredUser;
window.updateUserHydrationPoints = updateUserHydrationPoints;
window.getUserRank = getUserRank;