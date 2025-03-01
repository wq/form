export default {
    preset: "jest-expo",
    setupFiles: ["@wq/map-gl-native/setup-jest.js"],
    testMatch: ["**/__tests__/**/*.js?(x)"],
    transformIgnorePatterns: [],
};
