import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import { useAuth } from '@/hooks/useAuth';
import { clearAuthTokens } from '@/utils/storageSecureStore';
import { getUser,User } from '../services/user';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';
import HeaderProfile from '../components/headerProfile';
import { setAuthTokensWithManager } from '@/features/auth/services/authManager';

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

  // Charger toutes les datas des appels API ici et dispatch aux composants
  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    };
  
    const loadUser = async () => {
      const user = await getUser();
      console.log("user = ", user);
      setUser(user);
    };
  
    loadUser();
  }, [isAuthenticated]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: 'center',
      // alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: ms(theme.spacing.sm)
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <HeaderProfile user={user}/>
      <Pressable onPress={() => handleLogout()}>
        <Text style={{ marginTop: 20 }}>Fake logout button</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// HEADER
  // Display login info => appel a l'api pour avoir mes datas
  // Display at least 4 details for the user => login , email, mobile(hidden), Piscine , point de correction, level + Profile Picture
// SECTION
  // Display user's skills with level and percentage
// SECTION
  // Display user's projects (Completed and failed)
// LOGOUT BUTTON
  // Allow navigating back
