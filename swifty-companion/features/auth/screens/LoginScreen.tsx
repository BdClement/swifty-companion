import { Animated, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { initiateLogin } from '../services/authService';
import { useResponsive } from '@/hooks/useResponsive';

import { useEffect, useRef, useState } from "react";
import { getErrorMessage } from '@/features/profile/hooks/use-api-error';

export default function LoginScreen() {
  const theme = useTheme();
  const { ms, hs, vs , isLandscape} = useResponsive();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const errorOpacity = useRef(new Animated.Value(0)).current;
  const errorTranslateY = useRef(new Animated.Value(20)).current;
  
  const [loginError, setLoginError] = useState<string | null>(null);
  // const [loginError, setLoginError] = useState<string | null>(
  //   "Test error: unable to start authentication. Please try again."
  // );

  const { authError } = useAuth();
  const displayedError = loginError ?? (authError ? getErrorMessage(authError) : null);

  const handleLogin = async () => {
    setLoginError(null);
    console.log('login');
    try {
      await initiateLogin();
    } catch (error) {
      setLoginError("Unable to start authentication. Please try again.");
    }
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!displayedError) return;

    errorOpacity.setValue(0);
    errorTranslateY.setValue(20);

    const animation = Animated.parallel([
      Animated.timing(errorOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(errorTranslateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]);
    animation.start();

    return () => animation.stop();
  }, [displayedError, errorOpacity, errorTranslateY]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: ms(theme.spacing.sm)
    },
    welcome: {
      fontSize: isLandscape ? ms(theme.typography.h2.fontSize) : ms(theme.typography.h1.fontSize),
      fontWeight: isLandscape ? theme.typography.h2.fontWeight : theme.typography.h1.fontWeight,
      fontFamily: theme.typography.h1.fontFamily,
      color: theme.colors.primary,
      textAlign: 'center',
      padding: ms(theme.spacing.lg)
    },
    loginButton: {
      margin: ms(theme.spacing.md),
      backgroundColor: theme.colors.primary,
      paddingVertical: vs(theme.spacing.md),
      paddingHorizontal: hs(theme.spacing.xl),
      borderRadius: ms(theme.radius.lg),
    },
    loginButtonPressed: {
      transform: [{ scale: 0.96 }], // réduit legerement la taille
    },
    textLoginButton: {
      color: theme.colors.background,
      fontSize: isLandscape? ms(theme.typography.caption.fontSize) : ms(theme.typography.body.fontSize),
      fontWeight: theme.typography.body.fontWeight,
      fontFamily: theme.typography.body.fontFamily,
    },
    errorContainer: {
      marginTop: ms(20),
      padding: ms(12),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: ms(6),
      backgroundColor: "#FDECEC",
    },
    error: {
      color: theme.colors.primary,
      textAlign: "center",
      fontSize: isLandscape? ms(theme.typography.caption.fontSize) : ms(theme.typography.body.fontSize),
      fontFamily: theme.typography.body.fontFamily,
    },
    errorAnimation: {
      transform: [{ translateY: errorTranslateY }],
    }
    
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Text
        style={[
          styles.welcome,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        Welcome on Swifty Companion
      </Animated.Text>
      <Pressable style={({ pressed }) => [
        styles.loginButton,
        pressed && styles.loginButtonPressed,
      ]} onPress={() => handleLogin()}>
        <Text style={styles.textLoginButton}>Login with 42</Text>
      </Pressable>
      {displayedError && (
        <Animated.View
          style={[styles.errorContainer, { opacity: errorOpacity }, styles.errorAnimation]}
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.error}>{displayedError}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}