// src/lib/library.js
// Local, per-browser bookmark + reading-progress tracking for the Library feature.
// No backend/database required.

const STORAGE_KEY = "edumotion_library_v1";

function defaultState() {
  return {
    bookmarks: {},      // { [bookId]: true }
    currentPage: {},    // { [bookId]: pageNumber }
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
    // localStorage unavailable — fail silently
  }
}

export function isBookmarked(bookId) {
  return !!load().bookmarks[bookId];
}

export function toggleBookmark(bookId) {
  const state = load();
  if (state.bookmarks[bookId]) {
    delete state.bookmarks[bookId];
  } else {
    state.bookmarks[bookId] = true;
  }
  save(state);
  return !!state.bookmarks[bookId];
}

export function getCurrentPage(bookId) {
  const state = load();
  return state.currentPage[bookId] || 1;
}

export function setCurrentPage(bookId, page) {
  const state = load();
  state.currentPage[bookId] = page;
  save(state);
}

export function getAllBookmarkedIds() {
  return Object.keys(load().bookmarks);
}
