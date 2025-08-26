module.exports = function (api) {
  api.cache(true);
  const isWeb =
    process.env.EXPO_OS === 'web' || process.env.BABEL_ENV === 'web';
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      ...(isWeb ? [require.resolve('react-native-web/babel')] : []),
    ],
    plugins: [
      // ['react-native-web/babel', { removeViewDescriptors: true }],
      'react-native-reanimated/plugin'
    ],
  };
};