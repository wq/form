module.exports = {
    testEnvironment: "jsdom",
    testMatch: ["**/__tests__/**/*.js?(x)"],
    testPathIgnorePatterns: ["/node_modules/", ".mock.js"],
    transformIgnorePatterns: [
        "/node_modules/(?!(@mapbox/mapbox-gl-draw|@mapbox/point-geometry|@wq|nanoid|formik-mui|mui2-file-dropzone))",
    ],
};
