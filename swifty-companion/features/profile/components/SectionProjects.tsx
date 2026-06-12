import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import ProjectCard from "./ProjectCard";
import { ProjectUser } from "../types/type";

type SectionProjectsProps = {
    userProjects : ProjectUser[] | null;
}

export default function SectionProjects({userProjects} : SectionProjectsProps) {
    const theme = useTheme();
    const { ms, hs, vs , isLandscape} = useResponsive();

    const styles = StyleSheet.create({
        container: {
            padding: isLandscape ? ms(8) : ms(20),
            borderBottomWidth: ms(1),
            borderColor: theme.colors.primary,
        },
        header: {
            marginBottom: isLandscape? ms(10) : ms(20),
            alignItems: "center"
        },
        title: {
            fontSize: isLandscape? ms(18) : ms(24),
            fontWeight: "bold",
            fontFamily: theme.typography.body.fontFamily,
            color: theme.colors.primary
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Projects</Text>
            </View>
            <FlatList
            data={userProjects}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}// Déja un ScrollView parent
            renderItem={({ item }) => (
                <ProjectCard project={item}/>
            )}
            />
        </View>
    )
}