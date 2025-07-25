// src/utils/formatDate.js (or utils/formatDate.js)
export function formatDate(timestamp) {
  if (!timestamp) return '';
  // Firestore Timestamps have a toDate() method
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}