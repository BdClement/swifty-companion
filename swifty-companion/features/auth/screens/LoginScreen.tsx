import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { initiateLogin } from '../services/authService';

const handleLogin = async () => {
  console.log('login');
  try {
    await initiateLogin();
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
      <Pressable onPress={() => handleLogin}>
        <Text style={{ marginTop: 20, color: theme.colors.text}}>Fake login button</Text>
      </Pressable>
    </View>
  );
}