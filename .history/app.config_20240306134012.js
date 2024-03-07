import { ExpoConfig } from 'expo/config';
import { config } from 'dotenv';
import path from 'path';

const env_file = path.join(__dirname, '.env');
const env = config({
  path: env_file,
});

if (env.error) {
  console.log('ENV FILE ERROR: ', env_file);
  throw env.error;
}

export const expoConfig = {
  scheme: 'myapp',
  name: 'SpotMe',
  slug: 'SpotMe',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },

  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.anonymous.SpotMe',
    supportsTablet: true,
    infoPlist: {
      "UIBackgroundModes": [
        "location",
        "fetch",
        "remote-notification"
      ]
    }
  },
  android: {
    package: 'com.anonymous.SpotMe',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    permissions: [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.FOREGROUND_SERVICE"
    ],
    intentFilters: [
      {
        action: 'VIEW',
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: './assets/favicon.png',
  },
  plugins: [
    "expo-router",
    [
      "@rnmapbox/maps",
      {
        "RNMapboxMapsDownloadToken": "sk.eyJ1IjoiNTI0ODc2NDY2IiwiYSI6ImNsc3doZzh4eDBkaWwybGxhN2l1dXVicTUifQ.WRqz-s1fU1St1FQAuQsmDA"
      }
    ],
    [
      "expo-location",
      {
        "locationAlwaysAndWhenInUsePermission": "Allow Spot Me to use your location."
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    ...env.parsed,
  },
};

export default expoConfig;