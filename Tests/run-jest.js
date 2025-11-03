// Tests/run-jest.js
// Custom Jest runner to avoid permission issues / 自定义Jest运行器避免权限问题

const { runCLI } = require('jest');
const path = require('path');

console.log('🚀 Starting Jest tests via Node.js...');

const config = {
  rootDir: path.resolve(__dirname, '..'),
  testMatch: [
    '<rootDir>/Tests/Unit/**/*.test.js',
    '<rootDir>/Tests/Integration/**/*.test.js'
  ],
  coverageDirectory: '<rootDir>/Tests/coverage',
  collectCoverageFrom: [
    '<rootDir>/Backend/**/*.js',
    '!<rootDir>/Backend/node_modules/**'
  ],
  testEnvironment: 'node',
  verbose: true
};

runCLI(config, [__dirname]).then((result) => {
  if (result.results.success) {
    console.log('✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
}).catch((error) => {
  console.error('💥 Jest execution error:', error);
  process.exit(1);
});