import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import { useAuth } from '@/hooks/useAuth';
import { clearAuthTokens } from '@/utils/storageSecureStore';
import { exteractUserProjects, extractLastActiveCursus, extractUser, getMe } from '../services/data';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import HeaderProfile from '../components/headerProfile';
import { setAuthTokensWithManager } from '@/features/auth/services/authManager';
import SectionSkills from '../components/SectionSkills';
import SectionProjects from '../components/SectionProjects';
import { getErrorMessage, useApiError } from '../hooks/use-api-error';
import { AppError } from '@/features/auth/types/type';
import { CursusUser, ProjectUser, User } from '../types/type';

const handleLogout = () => {
  console.log('logout');
  setAuthTokensWithManager(null);
}

export default function ProfileScreen() {
  const theme = useTheme();
  const { ms, isLandscape} = useResponsive();
  const { isAuthenticated } = useAuth();
  // A partager avec un context si beaucoup de composants enfant en ont besoin sinon passer via props
  const [user, setUser] = useState<User | null>(null)// Utilisation d'un useState pour rerender au changement 
  const [lastActiveCursus, setlastActiveCursus] = useState<CursusUser | null>(null)
  const [userProjects, setUserProjects] = useState<ProjectUser[] | null>(null);
  const {apiError, setApiError} = useApiError();

  // Charger toutes les datas des appels API ici et dispatch aux composants
  const loadUser = async () => {
    try {
      setApiError(null);
      const me = await getMe();

      const user = extractUser(me);
      console.log("user = ", user);
      setUser(user);

      const lastActiveCursus = extractLastActiveCursus(me);
      console.log("lastActiveCursus skills = ", lastActiveCursus?.skills);
      setlastActiveCursus(lastActiveCursus);
      
      if (lastActiveCursus) {
        const userProjects = exteractUserProjects(me, lastActiveCursus.cursus_id)
        for (const p of userProjects) {
          console.log(p);
        }
        setUserProjects(userProjects);
      }
    } catch (error) {
      setApiError(error as AppError);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      setlastActiveCursus(null);
      setUserProjects(null);
      setApiError(null);
      return;
    };
    loadUser();
  }, [isAuthenticated]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: ms(theme.spacing.sm)
    },
    scrollContainer: {
      // A voir comme ça pour l'instant
    },
    logoutSection: {
      flex: 1,
      paddingBottom: isLandscape? ms(8) : ms(12),
      alignItems: "flex-end"
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
    errorContainer: {
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      borderWidth: isLandscape? ms(1) : ms(2),
      borderColor: "black",
    },
    
    errorTitle: {
      fontSize: ms(18),
      fontWeight: "bold",
      marginBottom: ms(10),
    },
    
    errorMessage: {
      fontSize: ms(14),
      textAlign: "center",
      marginBottom: ms(20),
    },
    
    retryButton: {
      paddingVertical: ms(10),
      paddingHorizontal: ms(20),
      backgroundColor: theme.colors.primary,
      borderRadius: ms(8),
    },
    
    retryText: {
      color: "white",
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>

        {apiError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorMessage}>
              {getErrorMessage(apiError)}
            </Text>

            <Pressable onPress={loadUser} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.logoutSection}>
            <Pressable onPress={() => handleLogout()} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
          </View>
          <HeaderProfile user={user} lastActiveCursus={lastActiveCursus}/>
          <SectionSkills lastActiveCursus={lastActiveCursus}/>
          <SectionProjects userProjects={userProjects}/>
        </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}