// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: 'ts-jest',
//   clearMocks: true,
//   moduleFileExtensions: ['ts','js'],
//   roots: ['<rootDir>'],
//   testEnvironment: 'node',
//   transform: {
//     '^.+\\.ts?$': 'ts-jest',
//   },
//   setupFilesAfterEnv: ['jest-extended'],
//   // setupFiles: ['dotenv/config'],
//   globals: {
//     'ts-jest': {
//       diagnostics: false,
//     },
//   },
//   globalSetup: '<rootDir>/src/__test__/dbSetup/global-setup.ts',
//   globalTeardown: '<rootDir>/src/__test__/dbSetup/global-teardown.ts',
// }

import type { Config } from "@jest/types";
export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
     
   verbose: true,
  //  setupFilesAfterEnv: ['jest-extended'],
   setupFiles: ["dotenv/config"],
   testMatch: ["**/**/*.test.ts"],
   testEnvironment: "node",
   detectOpenHandles: true,
  //  collectCoverage: true,
   transform: { "^.+\\.tsx?$": "ts-jest" },
   globalSetup: '<rootDir>/src/__test__/dbSetup/global-setup.ts',
   globalTeardown: '<rootDir>/src/__test__/dbSetup/global-teardown.ts',
   forceExit: true,
 };
};