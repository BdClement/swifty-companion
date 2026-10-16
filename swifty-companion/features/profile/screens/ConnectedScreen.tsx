import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { setAuthTokensWithManager } from '@/features/auth/services/authManager';

// A deplacer car logique dupliquer entre les 2 screens
const handleLogout = () => {
  console.log('logout');
  setAuthTokensWithManager(null);
}

export default function ConnectedScreen() {
  const theme = useTheme();
  const { ms, isLandscape} = useResponsive();
  const { isAuthenticated } = useAuth();
  
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
      borderWidth: isLandscape? ms(1) : ms(2),
      borderColor: "black",
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
        // height: "100%",
        // borderWidth: 2,
        // borderColor: "black",
        justifyContent: "center"
    },
    textInput: {
        height: isLandscape? "20%" : "8%",
        padding : isLandscape ? ms(6) : ms(10),
        margin : isLandscape ? ms(2) : ms(5),
        fontSize: isLandscape? ms(14) : ms(24),
        color: theme.colors.background,
        backgroundColor: theme.colors.primary,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: "black",
    }
  });
  
  return (
    <SafeAreaView style={styles.container}>
        {/* <ScrollView style={styles.scrollContainer}> */}
            <View style={styles.logoutSection}>
              <Pressable onPress={() => handleLogout()} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </Pressable>
            </View>
            <View style={styles.inputSection}>
                {/* clavier sur demande */}
                <TextInput
                    editable={true}
                    maxLength={40}
                    style={styles.textInput}
                    cursorColor={theme.colors.background}
                    textAlign='center'
                    keyboardType='default'
                    placeholder='Search 42 login...'
                    placeholderTextColor={theme.colors.background}
                    // returnKeyType="search"
                />
            </View>
        {/* </ScrollView> */}
    </SafeAreaView>
  )
}