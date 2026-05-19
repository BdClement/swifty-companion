import { View, Text,  } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function OAuthCallback() {

  const theme = useTheme();
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Authenticating ...</Text>
      </View>
    );
  }