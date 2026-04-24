import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { initiateLogin } from '../services/authService';

const handleLogin = async (setIsAuhtenticated) => {
  console.log('login');
  try {
    // Recuperer depuis login pour mettre a jour le context
    await initiateLogin();
    setIsAuhtenticated(true);
  } catch (error) {
    console.error('Login error: ', error);
  }
}

export default function LoginScreen() {
  const { isAuthenticated, setIsAuhtenticated} = useAuth();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>LOGIN SCREEN</Text>
      <Pressable onPress={() => handleLogin(setIsAuhtenticated)}>
        <Text style={{ marginTop: 20, color: theme.colors.text}}>Fake login button</Text>
      </Pressable>
    </View>
  );
}