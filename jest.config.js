// eslint-disable-next-line no-undef
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '^@/(.*)': '<rootDir>/src/$1',
    },
    runner: '@jest-runner/electron',
    testEnvironment: 'node',
};
