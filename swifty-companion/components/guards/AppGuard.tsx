import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AppGuard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  // Donne la position du user sur l'app sous forme de tableau
  const segments = useSegments();

  useEffect(() => {
    const inAuth = segments[0] === '(auth)';
    const inProtected = segments[0] === '(protected)';

    // pas connecté mais dans zone protégée → redirige auth
    if (!isAuthenticated && inProtected) {
      router.replace('/(auth)/login');
    }

    // connecté mais dans auth → redirige app
    if (isAuthenticated && inAuth) {
      router.replace('/(protected)/profile');
    }
  }, [isAuthenticated, segments]);

  return null;
}