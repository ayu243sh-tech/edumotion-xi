// src/lib/progress.js
// Local, per-browser progress tracking. No backend/database required.
// Everything is stored under one key in localStorage as a single JSON object.

const STORAGE_KEY = "edumotion_progress_v1";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"]; // Sun-first, matches JS getDay()

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function defaultState() {
  return {
    chapters: {},       // { [chapterId]: { progress: 0-100, lastOpened: iso } }
    quizzes: {},        // { [chapterId]: { done: true, score, date } }
    streak: { current: 0, lastActiveDay: null },
    dailyMinutes: {},   // { "YYYY-MM-DD": minutes }
    recentActivity: [], // [{ type, title, time }], newest first, capped at 20
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing etc.) — fail silently
  }
}

function pushActivity(state, entry) {
  state.recentActivity = [
    { ...entry, time: "just now" },
    ...state.recentActivity,
  ].slice(0, 20);
}

function bumpStreak(state) {
  const today = todayKey();
  if (state.streak.lastActiveDay === today) return; // already counted today
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  state.streak.current =
    state.streak.lastActiveDay === yesterday ? state.streak.current + 1 : 1;
  state.streak.lastActiveDay = today;
}

// ---------- Public API ----------

export function markChapterProgress(chapterId, percent, chapterMeta = {}) {
  const state = load();
  state.chapters[chapterId] = {
    progress: Math.max(0, Math.min(100, percent)),
    lastOpened: new Date().toISOString(),
  };
  bumpStreak(state);
  pushActivity(state, { type: "notes", title: chapterMeta.name || chapterId });
  save(state);
}

export function markQuizDone(chapterId, score, chapterMeta = {}) {
  const state = load();
  state.quizzes[chapterId] = { done: true, score, date: new Date().toISOString() };
  bumpStreak(state);
  pushActivity(state, { type: "test", title: `${chapterMeta.name || chapterId} — Quiz` });
  save(state);
}

export function logStudyMinutes(minutes) {
  const state = load();
  const day = todayKey();
  state.dailyMinutes[day] = (state.dailyMinutes[day] || 0) + minutes;
  bumpStreak(state);
  save(state);
}

export function logVideoWatched(chapterId, chapterMeta = {}) {
  const state = load();
  bumpStreak(state);
  pushActivity(state, { type: "video", title: chapterMeta.name || chapterId });
  save(state);
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

// Builds the exact shape Dashboard.jsx expects, computed from raw saved data.
export function getDashboardData(catalogChapters = []) {
  const state = load();

  const chaptersCompleted = Object.values(state.chapters).filter(
    (c) => c.progress >= 100
  ).length;

  const testsTaken = Object.keys(state.quizzes).length;

  const totalMinutes = Object.values(state.dailyMinutes).reduce((a, b) => a + b, 0);
  const hoursStudied = Math.round((totalMinutes / 60) * 10) / 10;

  // "Continue learning" = most recently opened chapter that isn't finished
  let continueLearning = null;
  const inProgress = Object.entries(state.chapters)
    .filter(([, c]) => c.progress < 100)
    .sort((a, b) => new Date(b[1].lastOpened) - new Date(a[1].lastOpened));
  if (inProgress.length) {
    const [chapterId, c] = inProgress[0];
    const meta = catalogChapters.find((ch) => ch.id === chapterId);
    if (meta) continueLearning = { ...meta, progress: c.progress };
  }

  // Daily goal — simple fixed targets, "done" counts today's actions
  const today = todayKey();
  const chaptersToday = Object.values(state.chapters).filter(
    (c) => c.lastOpened && c.lastOpened.slice(0, 10) === today
  ).length;
  const quizzesToday = Object.values(state.quizzes).filter(
    (q) => q.date && q.date.slice(0, 10) === today
  ).length;
  const minutesToday = state.dailyMinutes[today] || 0;

  // Last 7 days of study minutes, Mon-Sun order to match Dashboard.jsx's days=["M","T","W","T","F","S","S"]
  const weeklyMinutes = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    weeklyMinutes.push(state.dailyMinutes[d] || 0);
  }
  // Rotate so Monday is first (JS week starts Sunday)
  const jsDay = new Date().getDay(); // 0=Sun..6=Sat, "today" is last entry (index 6)
  const mondayOffset = (jsDay + 6) % 7; // days since most recent Monday
  const rotated = [
    ...weeklyMinutes.slice(6 - mondayOffset),
    ...weeklyMinutes.slice(0, 6 - mondayOffset),
  ];

  return {
    user: { name: "Learner" }, // no login system — generic greeting
    stats: {
      chapters_completed: chaptersCompleted,
      hours_studied: hoursStudied,
      tests_taken: testsTaken,
      current_streak: state.streak.current,
    },
    continue_learning: continueLearning,
    daily_goal: {
      chapters: { done: chaptersToday, target: 1 },
      quiz: { done: quizzesToday, target: 1 },
      lecture: { done: minutesToday >= 20 ? 1 : 0, target: 1 },
    },
    achievements: [], // fill from seed_data ACHIEVEMENTS if you want to unlock these later
    leaderboard: [], // fill from seed_data LEADERBOARD (static) if you still want to show it
    recent_activity: state.recentActivity,
    weekly_minutes: rotated,
  };
}
