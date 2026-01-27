export default {
    preset: "jest-expo",
    testMatch: ["**/__tests__/**/*.js?(x)"],
    transformIgnorePatterns: [],
    moduleNameMapper: {
        "@wq/form-native": "<rootDir>/src/index.js",
    },
};
