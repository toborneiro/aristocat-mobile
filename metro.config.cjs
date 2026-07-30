const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const zodCorePath = path.resolve(
  __dirname,
  'node_modules/zod/v4/core/index.cjs'
);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zod/v4/core') {
    return {
      filePath: zodCorePath,
      type: 'sourceFile'
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
