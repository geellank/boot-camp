// __tests__/formatDate.test.js
import { formatDate } from '../src/utils/formatDate'; // Adjust path if not in src

// Mock a Firestore Timestamp object for testing
const mockFirestoreTimestamp = (date) => ({
  toDate: () => new Date(date),
  // You can add other properties if needed for more complex mocks
});

describe('formatDate', () => {
  it('should format a Date object correctly', () => {
    const date = new Date('2023-07-25T10:00:00Z');
    expect(formatDate(date)).toBe('Jul 25, 2023, 10:00 AM');
  });

  it('should format a Firestore Timestamp object correctly', () => {
    const timestamp = mockFirestoreTimestamp('2024-01-15T14:30:00Z');
    expect(formatDate(timestamp)).toBe('Jan 15, 2024, 02:30 PM');
  });

  it('should return empty string for null or undefined input', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('should handle invalid date strings gracefully', () => {
    expect(formatDate('invalid-date')).toBe('Invalid Date'); // JS Date() returns "Invalid Date" for invalid inputs
  });
});