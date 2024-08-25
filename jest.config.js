/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    preset: 'ts-jest',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

