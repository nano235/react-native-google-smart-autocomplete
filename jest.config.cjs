module.exports = {
    preset: 'react-native',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transform: {
      '^.+\\.[jt]sx?$': ['babel-jest', { presets: ['module:metro-react-native-babel-preset'] }],
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    transformIgnorePatterns: [
      'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|strip-ansi|string-width)'
    ],
    moduleNameMapper: {
      'strip-ansi': 'strip-ansi/index.js',
    },
  };
  