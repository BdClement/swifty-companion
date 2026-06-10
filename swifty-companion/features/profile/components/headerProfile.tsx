import { Image, Text, View, StyleSheet } from "react-native";
import DEFAULT_IMAGE from"../../../assets/images/avatar-default.webp"
import { CursusUser, User } from "../services/data";
import { useResponsive } from "@/hooks/useResponsive";
import { useTheme } from "@/hooks/useTheme";


type HeaderProfileProps = {
    user: User | null;
    lastActiveCursus: CursusUser | null;
};

export default function HeaderProfile({ user, lastActiveCursus } : HeaderProfileProps) {
    const theme = useTheme();
    const { ms, hs, vs , isLandscape} = useResponsive();
    const source = user?.image === "default" ? DEFAULT_IMAGE : {uri: user?.image}
    // const source = DEFAULT_IMAGE
    console.log("source Avatar = ", source);
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingBottom: isLandscape ? ms(8) : ms(20),
            borderBottomWidth: ms(1),
            borderColor: theme.colors.primary,
            flexDirection: "row",
            justifyContent: "space-evenly"

        },
        image: {
            width: isLandscape? ms(70): ms(100),
            height: isLandscape? ms(70): ms(100),
            borderRadius: ms(100),
            borderColor: theme.colors.primary,
            borderWidth: 1
        },
        infoContainer: {
            flex: 1,
            padding: isLandscape? ms(10) : ms(4),
            marginLeft: isLandscape? ms(10) : ms(6),
            borderColor: "black",
            flexDirection: "row",
        },
        infoContainerLabel: {
            justifyContent: "space-evenly",
            textAlign: "left",
        },
        Label: {
            color: theme.colors.primary,
            fontWeight: "bold",
            fontSize: isLandscape? ms(10) : ms(14)
        },
        infoContainerData: {
            flex: 1, 
            justifyContent: "space-evenly",
            alignItems: "flex-end",
        },
        data: {
            fontSize: isLandscape? ms(10) : ms(14)
        }
    });

    return (
    <View style={styles.container}>
        <Image source={source} style={styles.image}/>
        <View style={styles.infoContainer}>
            <View style={styles.infoContainerLabel}>
                <Text style={styles.Label}>Login</Text>
                <Text style={styles.Label}>Email</Text>
                <Text style={styles.Label}>Eval points</Text>
                <Text style={styles.Label}>Level</Text>
                <Text style={styles.Label}>Piscine</Text> 
            </View>
            <View style={styles.infoContainerData}>
                <Text style={styles.data}>{user?.login}</Text>
                <Text style={styles.data}>{user?.email}</Text>
                <Text style={styles.data}>{user?.correction_point}</Text>
                <Text style={styles.data}>{lastActiveCursus?.level}</Text>
                <Text style={styles.data}>{user?.pool_month} {user?.pool_year}</Text>
            </View>
        </View>
    </View>
    );
}