const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const zodCorePath = path.resolve(__dirname, 'node_modules/zod/v4/core/index.cjs');
const punycodePath = require.resolve('punycode/punycode.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zod/v4/core') {
    return {
      filePath: zodCorePath,
      type: 'sourceFile',
    };
  }

  if (moduleName === 'punycode') {
    return {
      filePath: punycodePath,
      type: 'sourceFile',
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
