import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { clearAuthTokens } from '@/utils/storageSecureStore';

const handleLogout = (setIsAuthenticated) => {
  console.log('logout');
  setIsAuthenticated(false);
  clearAuthTokens();
}

export default function ProfileScreen() {
  const { isAuthenticated, setIsAuthenticated} = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>PROFILE SCREEN</Text>
      <Pressable onPress={() => handleLogout(setIsAuthenticated)}>
        <Text style={{ marginTop: 20 }}>Fake logout button</Text>
      </Pressable>
    </View>
  );
}