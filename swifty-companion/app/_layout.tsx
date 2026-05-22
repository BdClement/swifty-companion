import { Stack } from 'expo-router';
import { ResponsiveProvider } from '@/contexts/ResponsiveContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AppGuard from '@/components/guards/AppGuard';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from '@expo-google-fonts/playwrite-us-modern/useFonts';
import {
  PlaywriteUSModern_100Thin,
  PlaywriteUSModern_200ExtraLight,
  PlaywriteUSModern_300Light,
  PlaywriteUSModern_400Regular,
} from "@expo-google-fonts/playwrite-us-modern";



export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlaywriteUSModern_100Thin, 
    PlaywriteUSModern_200ExtraLight, 
    PlaywriteUSModern_300Light, 
    PlaywriteUSModern_400Regular
  });

  if (!fontsLoaded) return null; // Important sinon les fonts de sont pas chargées
  return (
    <ResponsiveProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppGuard />
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </ResponsiveProvider>
  )
}