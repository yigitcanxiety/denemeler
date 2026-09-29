// Metro config for the pnpm monorepo (node-linker=hoisted).
// Expo's default config already detects workspaces (SDK 52+); we set the folders explicitly so
// @tonelle/shared (TypeScript source, resolved via its package.json "exports") is watched and
// transpiled, and so packages hoisted to the workspace root resolve.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [...new Set([...(config.watchFolders ?? []), workspaceRoot])];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
