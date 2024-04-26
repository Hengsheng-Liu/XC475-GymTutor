export const expoConfig = {
  expo: {
    scheme: "myapp",
    name: "SpotMe",
    slug: "spotme",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.spot-me.spotme",
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["location", "fetch", "remote-notification"],
      },
    },
    android: {
      package: "com.spot-me.spotme",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
      ],
      intentFilters: [
        {
          action: "VIEW",
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "https://spot-me.vercel.app",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow Spot Me to use your location.",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "22999ea1-0a5e-46c0-8465-f21aea1344fd",
      },
    },
    updates: {
      url: "https://u.expo.dev/22999ea1-0a5e-46c0-8465-f21aea1344fd",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    owner: "spot-me",
  },
};

export default expoConfig;
