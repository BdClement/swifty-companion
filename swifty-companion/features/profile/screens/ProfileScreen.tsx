import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo } from "react";
import { router } from 'expo-router';
import { useProfile } from '@/hooks/useProfile';
import { exteractUserProjects, extractCursus, extractUser } from '../services/data';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import HeaderProfile from '../components/headerProfile';
import { setAuthTokensWithManager } from '@/features/auth/services/authManager';
import SectionSkills from '../components/SectionSkills';
import SectionProjects from '../components/SectionProjects';
import { useAuth } from '@/hooks/useAuth';

const handleLogout = (clearProfile: () => void) => {
  console.log('logout');
  clearProfile();
  setAuthTokensWithManager(null);
}

export default function ProfileScreen() {
  const theme = useTheme();
  const { ms, isLandscape} = useResponsive();
  const { isAuthenticated } = useAuth();
  const { fullIdentity, setFullIdentity } = useProfile();

  // garde-fous
  useEffect(() => {
    if (!isAuthenticated) setFullIdentity(null);
    if (isAuthenticated && !fullIdentity) router.replace("/connected");
  }, [fullIdentity, isAuthenticated, setFullIdentity]);

  // useMemo pour ne recalculer les valeurs que si fullIdentity est modifiée
  const user = useMemo(
    () => fullIdentity ? extractUser(fullIdentity) : null,
    [fullIdentity]
  );
  console.log("user extracted === ", user);
  const cursus = useMemo(
    () => fullIdentity ? extractCursus(fullIdentity) : null,
    [fullIdentity]
  );
  console.log("cursus extracted === ", cursus);
  const userProjects = useMemo(
    () => fullIdentity && cursus
      ? exteractUserProjects(fullIdentity, cursus.cursus_id)
      : fullIdentity ? [] : null,
    [cursus, fullIdentity]
  );
  // console.log("");
  // console.log("projects extracted === ", userProjects);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: ms(theme.spacing.sm)
    },
    scrollContainer: {
      // A voir comme ça pour l'instant
    },
    headerActions: {
      paddingBottom: isLandscape? ms(8) : ms(12),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    backButton: {
      justifyContent: "center",
      paddingHorizontal: ms(8),
    },
    logoutButton: {
      paddingHorizontal: ms(theme.spacing.lg),
      paddingVertical: isLandscape? ms(4) : ms(theme.spacing.sm),
      // borderWidth: isLandscape? ms(1) : ms(2),
      // borderColor: "black",
      backgroundColor: theme.colors.primary,
      borderRadius: ms(6)
    },
    logoutButtonText: {
      color: theme.colors.background,
      fontSize: isLandscape? ms(10) : ms(14),
      fontWeight: "bold",
      fontFamily: theme.typography.body.fontFamily,
    },
  });

  if (!fullIdentity) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => {
                router.replace("/connected");
                console.log("Redirection vers /connected effectuée via ProfileScreen");
              }}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back to search"
            >
              <Ionicons name="chevron-back" size={ms(28)} color={theme.colors.primary} />
            </Pressable>
            <Pressable onPress={() => handleLogout(() => setFullIdentity(null))} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
          </View>
          <HeaderProfile user={user} lastActiveCursus={cursus}/>
          <SectionSkills lastActiveCursus={cursus} isProfileLoaded={user !== null}/>
          <SectionProjects userProjects={userProjects}/>

      </ScrollView>
    </SafeAreaView>
  );
}