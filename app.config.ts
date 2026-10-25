import type { ConfigContext, ExpoConfig } from 'expo/config';

const googleSignInPlugin = '@react-native-google-signin/google-signin';

export default ({ config }: ConfigContext): ExpoConfig => {
  const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME?.trim();

  return {
    ...config,
    plugins: config.plugins?.map((plugin) => {
      if (plugin !== googleSignInPlugin || !iosUrlScheme) return plugin;
      return [googleSignInPlugin, { iosUrlScheme }];
    }),
  };
};
