import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/useResponsive';

export default function OAuthCallback() {

  const theme = useTheme();
  const { ms, isLandscape } = useResponsive();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: ms(theme.spacing.sm)
    },
    textAuthenticating: {
      color: theme.colors.primary,
      fontSize: isLandscape? ms(theme.typography.body.fontSize) : ms(theme.typography.h2.fontSize),
      fontWeight: theme.typography.h2.fontWeight,
      fontFamily: theme.typography.h2.fontFamily,
    }
  });

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.textAuthenticating}>Authenticating ...</Text>
      </SafeAreaView>
    );
  }