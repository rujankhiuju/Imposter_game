module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required by react-native-reanimated / react-native-worklets.
      // Must be listed last.
      'react-native-worklets/plugin',
    ],
  };
};
