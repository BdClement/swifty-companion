import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AppGuard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  // Donne la position du user sur l'app sous forme de tableau
  const segments = useSegments();

  useEffect(() => {
    // Guard de sécurité conditionné a la connexion
    const inAuth = segments[0] === '(auth)';
    const inProtected = segments[0] === '(protected)';

    // Guard de navigation au sein de (protected)
    const inCallback= segments[1] === 'callback'
    const inConnected = segments[1] === 'connected'
    const inProfile = segments[1] === 'profile'
 
    console.log(`isAuthenticated == ${isAuthenticated}`)
    console.log(`resulate de segments == ${segments}`);
    console.log(`resulate de inAuth == ${inAuth}`);
    console.log(`resulate de inProtected == ${inProtected}`);
    console.log(`resulate de inCallback == ${inCallback}`);
    console.log(`resulate de inConnected == ${inConnected}`);
    console.log(`resulate de inProfile == ${inProfile}`);

    // pas connecté mais dans zone protégée → redirige auth
    if (!isAuthenticated && inProtected ) {
      router.replace('/(auth)/login');
      console.log("Redirection vers /login effectuée via AppGuard");
    }

    // connecté mais dans auth → redirige app
    if (isAuthenticated && inAuth) {
      router.replace('/(protected)/connected');
      console.log("Redirection vers /connected effectuée via AppGuard");
    }
    // Evaluer la pertinence de la redirection ici
    // if (isAuthenticated && inConnected && CONDITION ) {
    //   router.replace('/(protected)/profile');
    //   console.log("Redirection vers /profile effectuée via AppGuard");  
    // }

    console.log(`   `);
  }, [isAuthenticated, segments]);

  return null;
}