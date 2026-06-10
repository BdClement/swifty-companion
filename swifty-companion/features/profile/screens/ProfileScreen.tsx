import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import { useAuth } from '@/hooks/useAuth';
import { clearAuthTokens } from '@/utils/storageSecureStore';
import { CursusUser, exteractUserProjects, extractLastActiveCursus, extractUser, getMe, User } from '../services/data';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import HeaderProfile from '../components/headerProfile';
import { setAuthTokensWithManager } from '@/features/auth/services/authManager';
import SectionSkills from '../components/SectionSkills';

const handleLogout = () => {
  console.log('logout');
  // setIsAuthenticated(false);
  // clearAuthTokens();
  setAuthTokensWithManager(null);
  // setUser(null);// Fait dans le useEffect ici 
}

export default function ProfileScreen() {
  const theme = useTheme();
  const { ms, hs, vs , isLandscape} = useResponsive();
  const { isAuthenticated, setIsAuthenticated} = useAuth();
  // A partager avec un context si beaucoup de composants enfant en ont besoin sinon passer via props
  const [user, setUser] = useState<User | null>(null)// Utilisation d'un useState pour rerender au changement 
  const [lastActiveCursus, setlastActiveCursus] = useState<CursusUser | null>(null)

  // Charger toutes les datas des appels API ici et dispatch aux composants
  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      setlastActiveCursus(null);
      // setUserProjects(null);
      return;
    };
  
    const loadUser = async () => {
      // Ici getMe plutot
      const me = await getMe();
      // console.log("reponse de getMe via apiFetch = ", me);
      // PUIS function getUser a partir de Me
      const user = extractUser(me);
      console.log("user = ", user);
      setUser(user);

      // function getLastActiveCursus a aprtir de Me
      const lastActiveCursus = extractLastActiveCursus(me);
      console.log("lastActiveCursus skills = ", lastActiveCursus?.skills);
      setlastActiveCursus(lastActiveCursus);
      
      if (lastActiveCursus) {
        // console.log("lastActiveCursus.id === ", lastActiveCursus.cursus_id);
        const userProjects = exteractUserProjects(me, lastActiveCursus.cursus_id)
        // for (const p of userProjects) {
        //   console.log(p);
        // }
        // setUserProjects(userProjects);
      }
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
      // borderWidth: ms(2),
      // borderColor: "white",
      paddingBottom: isLandscape? ms(8) : ms(12),
      // justifyContent: "center",
      // alignContent: "center",
      alignItems: "flex-end"
    },
    logoutButton: {
      paddingHorizontal: ms(theme.spacing.lg),
      paddingVertical: ms(theme.spacing.sm),
      borderWidth: isLandscape? ms(1) : ms(2),
      // borderColor: "black",
      backgroundColor: theme.colors.primary,
      borderRadius: ms(6)
    },
    logoutButtonText: {
      color: theme.colors.background,
      fontSize: isLandscape? ms(10) : ms(14),
      fontWeight: "bold"
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.logoutSection}>
          <Pressable onPress={() => handleLogout()} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </View>
        <HeaderProfile user={user} lastActiveCursus={lastActiveCursus}/>
        <SectionSkills lastActiveCursus={lastActiveCursus}/>
        {/* <SectionProjects/> */}
      </ScrollView>
    </SafeAreaView>
  );
}

// HEADER
  // Display login info => appel a l'api pour avoir mes datas DONE
  // Display at least 4 details for the user => login , email, mobile(hidden), Piscine , point de correction, level + Profile Picture DONE
// SECTION
  // Display user's skills with level and percentage Possible a partir de me/
// SECTION
  // Display user's projects (Completed and failed)
// LOGOUT BUTTON
  // Allow navigating back
