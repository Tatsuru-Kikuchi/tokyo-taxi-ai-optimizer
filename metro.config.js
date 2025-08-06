const { getDefaultConfig } = require('@expo/metro-config');

// Get the default Expo Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Customize the config if needed
// Example: Add custom resolver or transformer settings
// defaultConfig.resolver.assetExts.push('your-custom-extension');

// For Tokyo Taxi AI Optimizer - ensure all assets are included
defaultConfig.resolver.assetExts.push(
  // Add any custom asset extensions if needed
  'db', 'mp3', 'ttf', 'obj', 'png', 'jpg'
);

// Enable TypeScript support if using TypeScript
defaultConfig.resolver.sourceExts.push('tsx', 'ts', 'jsx', 'js', 'json');

// Ensure proper handling of React Native modules
defaultConfig.resolver.platforms = ['ios', 'android', 'web', 'native'];

// Optimize for production builds
if (process.env.NODE_ENV === 'production') {
  defaultConfig.transformer.minifierConfig = {
    // Optimize bundle size
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  };
}

module.exports = defaultConfig;
