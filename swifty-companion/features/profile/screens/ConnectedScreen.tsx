import { ActivityIndicator, Animated, View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from "react";
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { setAuthTokensWithManager } from '@/features/auth/services/authManager';
import { useProfile } from '@/hooks/useProfile';
import { getFullIdentityFromLogin } from '../services/data';
import { AppError } from '@/features/auth/types/type';
import { getErrorMessage, useApiError } from '../hooks/use-api-error';

const handleLogout = (clearProfile: () => void) => {
  console.log('logout');
  clearProfile();
  setAuthTokensWithManager(null);
}

export default function ConnectedScreen() {
  const theme = useTheme();
  const { ms, isLandscape} = useResponsive();
  const { setFullIdentity } = useProfile();
  const { apiError, setApiError } = useApiError();
  const [login, setLogin] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const errorOpacity = useRef(new Animated.Value(0)).current;
  const errorTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!apiError) return;

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
  }, [apiError, errorOpacity, errorTranslateY]);

  const searchUser = async () => {
    const normalizedLogin = login.trim().toLowerCase();
    console.log("");
    console.log("searchUser");
    if (!normalizedLogin || isSearching) return;

    setApiError(null);
    setIsSearching(true);
    setFullIdentity(null);

    try {
        // console.log("before getFullIdentityFromLogin in searchUser");
      const identity = await getFullIdentityFromLogin(normalizedLogin);
    //   console.log("after getFullIdentityFromLogin in searchUser");
      setFullIdentity(identity);
      router.replace("/profile");
      console.log("setFullIdentity in searchUser ET Redirection vers Profile via ConnectedScreen");
    } catch (error) {
         console.log("catching error in searchUser : ", error);
      setApiError(error as AppError);
    } finally {
        //  console.log("finaly in searchUser");
      setIsSearching(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: ms(theme.spacing.sm),
      borderWidth: 2,
      borderColor: "white"
    },
    scrollContainer: {
      // A voir comme ça pour l'instant
    },
    logoutSection: {
    //   flex: 1,
      paddingBottom: isLandscape? ms(8) : ms(12),
      alignItems: "flex-end",
    //   borderWidth: 2,
    //   borderColor: "white"
    },
    logoutButton: {
      paddingHorizontal: ms(theme.spacing.lg),
      paddingVertical: isLandscape? ms(4) : ms(theme.spacing.sm),
    //   borderWidth: isLandscape? ms(1) : ms(2),
    //   borderColor: "black",
      backgroundColor: theme.colors.primary,
      borderRadius: ms(6)
    },
    logoutButtonText: {
      color: theme.colors.background,
      fontSize: isLandscape? ms(10) : ms(14),
      fontWeight: "bold",
      fontFamily: theme.typography.body.fontFamily,
    },
    inputSection: {
        flex: 1,
        justifyContent: "center",
        gap: isLandscape? ms(10) : ms(16),
    },
    textInput: {
        width: "100%",
        height: isLandscape? ms(44) : ms(56),
        padding : isLandscape ? ms(6) : ms(10),
        fontSize: isLandscape? ms(14) : ms(20),
        fontFamily: theme.typography.body.fontFamily,
        color: theme.colors.primary,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: theme.colors.primary,
    },
    searchButton: {
        alignSelf: "center",
        width: "50%",
        paddingHorizontal: ms(theme.spacing.lg),
        paddingVertical: isLandscape? ms(4) : ms(theme.spacing.sm),
        backgroundColor: theme.colors.primary,
        borderRadius: ms(6),
        opacity: isSearching || !login.trim() ? 0.55 : 1,
    },
    searchButtonText: {
        color: theme.colors.background,
        textAlign: "center",
        fontSize: isLandscape? ms(10) : ms(14),
        fontWeight: "bold",
        fontFamily: theme.typography.body.fontFamily,
    },
    errorContainer: {
        padding: ms(12),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: ms(6),
        backgroundColor: "#FDECEC",
    },
    errorAnimation: {
        transform: [{ translateY: errorTranslateY }],
    },
    error: {
        color: theme.colors.primary,
        textAlign: "center",
        fontSize: isLandscape? ms(10) : ms(14),
        fontFamily: theme.typography.body.fontFamily,
    },
    searchingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    searching: {
        color: theme.colors.primary,
        marginStart: ms(8),
        fontSize: isLandscape? ms(10) : ms(14),
        fontFamily: theme.typography.body.fontFamily,
    },
  });
  
  return (
    <SafeAreaView style={styles.container}>
        {/* <ScrollView style={styles.scrollContainer}> */}
            <View style={styles.logoutSection}>
              <Pressable onPress={() => handleLogout(() => setFullIdentity(null))} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </Pressable>
            </View>
            <View style={styles.inputSection}>
                <TextInput
                    editable={!isSearching}
                    maxLength={40}
                    style={styles.textInput}
                    cursorColor={theme.colors.primary}
                    textAlign='center'
                    keyboardType='default'
                    placeholder='Search 42 login...'
                    placeholderTextColor={theme.colors.primary}
                    value={login}
                    onChangeText={(value) => {
                      setLogin(value);
                      if (apiError) setApiError(null);
                    }}
                    returnKeyType="search"
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    autoComplete="off"
                    onSubmitEditing={searchUser}
                />
                <Pressable
                    onPress={searchUser}
                    disabled={isSearching || !login.trim()}
                    style={styles.searchButton}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isSearching || !login.trim() }}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </Pressable>
                {apiError && (
                    <Animated.View
                        style={[styles.errorContainer, { opacity: errorOpacity }, styles.errorAnimation]}
                        accessibilityLiveRegion="polite"
                    >
                        <Text style={styles.error}>{getErrorMessage(apiError)}</Text>
                    </Animated.View>
                )}
                {isSearching && (
                    <View style={styles.searchingContainer} accessibilityLiveRegion="polite">
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                        <Text style={styles.searching}>Searching...</Text>
                    </View>
                )}
            </View>
    </SafeAreaView>
  )
}