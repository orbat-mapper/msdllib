module.exports = {
  preset: "ts-jest",
  coverageReporters: ["html"],
  testMatch: ["<rootDir>/test/**/*.test.ts"],
  roots: ["src", "test"],
  testURL: "http://localhost/"
};
