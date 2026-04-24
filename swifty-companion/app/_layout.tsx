import { Stack } from 'expo-router';
import { ResponsiveProvider } from '@/contexts/ResponsiveContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AppGuard from '@/components/guards/AppGuard';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
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