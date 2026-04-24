import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

const handleLogout = (setIsAuhtenticated) => {
  console.log('logout');
  setIsAuhtenticated(false);
}

export default function ProfileScreen() {
  const { isAuthenticated, setIsAuhtenticated} = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>PROFILE SCREEN</Text>
      <Pressable onPress={() => handleLogout(setIsAuhtenticated)}>
        <Text style={{ marginTop: 20 }}>Fake login button</Text>
      </Pressable>
    </View>
  );
}