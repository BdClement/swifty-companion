import { Image, Text, View, StyleSheet } from "react-native";
import DEFAULT_IMAGE from"../../../assets/images/default-avatar.jpg"
import { User } from "../services/user";
import { useResponsive } from "@/hooks/useResponsive";
import { useTheme } from "@/hooks/useTheme";


type Props = {
    user: User | null;
  };

export default function HeaderProfile({ user }: Props) {
    const theme = useTheme();
    const { ms, hs, vs , isLandscape} = useResponsive();
    const source = user?.image === "default" ? DEFAULT_IMAGE : {uri: user?.image}
    // const source = DEFAULT_IMAGE
    console.log("source Avatar = ", source);
    
    const styles = StyleSheet.create({
        container: {
            borderWidth: ms(1),
            borderColor: "black",
            width: "100%",// bien ca ?
            flexDirection: "row",
            justifyContent: "space-around"
        },
        image: {

        },
        infoContainer: {
            borderWidth: ms(1),
            borderColor: "black",
            width: "100%"            
        }
    });

    return (
    <View style={styles.container}>
        <Image source={source} style={{width: 100, height: 100, borderRadius: 100, borderWidth: 2, borderColor: theme.colors.primary}}/>
        <View style={styles.infoContainer}>
            <Text>Login: {user?.login}</Text>
            <Text>Email: {user?.email}</Text>
            <Text>Evalutation points: {user?.login}</Text>
            <Text>Level</Text>
            <Text>Piscine</Text>
        </View>
    </View>
    );
}
// login, email, Piscine, point de correction, level ?? + Profile picture