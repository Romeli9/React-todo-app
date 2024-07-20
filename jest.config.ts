import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', 
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy' 
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', 
    '^.+\\.(js|jsx)$': 'babel-jest' 
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
}

export default jestConfig
