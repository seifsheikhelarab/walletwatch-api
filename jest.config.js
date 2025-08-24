import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  clearMocks: true,
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/src"],
  testMatch: ["**/tests/*.test.(ts|js)"],
};
