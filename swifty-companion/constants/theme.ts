// /**
//  * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
//  * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
//  */

// import { Platform } from 'react-native';

// const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';

// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//   },
// };

// export const Fonts = Platform.select({
//   ios: {
//     /** iOS `UIFontDescriptorSystemDesignDefault` */
//     sans: 'system-ui',
//     /** iOS `UIFontDescriptorSystemDesignSerif` */
//     serif: 'ui-serif',
//     /** iOS `UIFontDescriptorSystemDesignRounded` */
//     rounded: 'ui-rounded',
//     /** iOS `UIFontDescriptorSystemDesignMonospaced` */
//     mono: 'ui-monospace',
//   },
//   default: {
//     sans: 'normal',
//     serif: 'serif',
//     rounded: 'normal',
//     mono: 'monospace',
//   },
//   web: {
//     sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
//     serif: "Georgia, 'Times New Roman', serif",
//     rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
//     mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
//   },
// });

// L'idée est de declarer les données globales propres a des thèmes et de les transmettre a tout les composants
// On peut penser a jouter des éléments comme les typographie, les spacings systems, les style de button etc

const fonts = {
  thin: "PlaywriteUSModern_100Thin",
  extraLight: "PlaywriteUSModern_200ExtraLight",
  light: "PlaywriteUSModern_300Light",
  regular: "PlaywriteUSModern_400Regular",
};

type TypoStyle = {
  fontSize: number;
  fontWeight: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  fontFamily: string,
}

type TypographyScale = {

  h1: TypoStyle;
  h2: TypoStyle;
  body: TypoStyle;
  caption: TypoStyle;
};

const typo: TypographyScale = {
  h1: { fontSize: 32, fontWeight: "900", fontFamily: fonts.regular },
  h2: { fontSize: 26, fontWeight: "600", fontFamily: fonts.regular },
  body: { fontSize: 16, fontWeight: "400", fontFamily: fonts.regular },
  caption: { fontSize: 12, fontWeight: "400", fontFamily: fonts.regular },
}

const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

const rad = {
    sm: 6,
    md: 12,
    lg: 20,
    xl: 28,
    full: 9999,
}

export const lightTheme = {
  colors: {
    background: '#EDDFCC',
    text: '#803711',// TBD
    primary: '#910909',
  },
  typography : typo,
  radius: rad,
  spacing: space,
};

export const darkTheme = {
  colors: {
    background: '#000000',
    text: '#ffffff',// TBD
    primary: '#55CC00',
  },
  typography : typo,
  radius: rad,
  spacing: space,
};