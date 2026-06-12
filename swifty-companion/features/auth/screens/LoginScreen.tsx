import { Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { initiateLogin } from '../services/authService';
import { useResponsive } from '@/hooks/useResponsive';

import { Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { getErrorMessage } from '@/features/profile/hooks/use-api-error';

export default function LoginScreen() {
  const theme = useTheme();
  const { ms, hs, vs , isLandscape} = useResponsive();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  
  const [loginError, setLoginError] = useState<string | null>(null);

  const { authError } = useAuth();

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
    error: {
      color: "red",
      fontSize: isLandscape? ms(theme.typography.caption.fontSize) : ms(theme.typography.body.fontSize),
      marginTop: ms(30)
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
      {loginError && (
        <Text style={styles.error}>
          {loginError}
        </Text>
      )}
      {authError && (
        <Text style={styles.error}>
          {getErrorMessage(authError)}
        </Text>
      )}
    </SafeAreaView>
  );
}