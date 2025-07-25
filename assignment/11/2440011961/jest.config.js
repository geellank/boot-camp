// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle CSS imports (if you use CSS modules)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Important for Next.js 13+ with Babel
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  // Ensure Jest looks for tests in __tests__ directories
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};