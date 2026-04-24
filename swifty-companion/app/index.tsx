import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { isAuthenticated } = useAuth();
  console.log("isAuthenticated dans Index == ", isAuthenticated);

  return (
    <Redirect
      href={isAuthenticated ? '/(protected)/profile' : '/(auth)/login'}
    />
  );
}
