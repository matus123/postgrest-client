module.exports = {
  verbose: true,
  testEnvironment: 'node',
  testRegex: '(/test/|/src/).*spec\\.(jsx?|tsx?)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ]
};
