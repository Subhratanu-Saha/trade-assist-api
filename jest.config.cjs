module.exports = {
    testEnvironment: "node",

    roots: ["<rootDir>/src"],

    testMatch: [
        "**/tests/**/*.test.js",
        "**/?(*.)+(spec|test).js",
    ],

    testPathIgnorePatterns: [
        "/node_modules/",
    ],

    collectCoverage: true,

    collectCoverageFrom: [
        // Services
        "src/services/**/*.js",
        "!src/services/tests/**",

        // Controllers
        "src/controllers/**/*.js",
        "!src/controllers/tests/**",

        // Middleware
        "src/middleware/**/*.js",
        "!src/middleware/tests/**",

        // Routes
        "src/routes/**/*.js",
        "!src/routes/tests/**",
    ],

    coverageDirectory: "coverage",

    coverageReporters: [
        "text",
        "html",
    ],

    verbose: true,
};