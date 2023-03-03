module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/node_modules/',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/serviceWorker.ts',
    '!src/serviceWorkerRegistration.ts',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    browsers: ['chrome', 'firefox', 'safari'],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
