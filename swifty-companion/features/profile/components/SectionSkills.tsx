import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import SkillBar from './SkillBar';
import { CursusUser } from "../types/type";

type SectionSkillsProps = {
    lastActiveCursus: CursusUser | null;
    isProfileLoaded: boolean;
}

export default function SectionSkills({lastActiveCursus, isProfileLoaded} : SectionSkillsProps) {
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
        },
        emptyMessage: {
            color: theme.colors.primary,
            fontSize: isLandscape? ms(10) : ms(14),
            textAlign: "center",
            paddingVertical: ms(8),
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Skills</Text>
            </View>
            {lastActiveCursus?.skills.length ? (
                lastActiveCursus.skills.map(skill => (
                    <SkillBar key={skill.id} skill={skill}/>
                ))
            ) : isProfileLoaded ? (
                <Text style={styles.emptyMessage}>No skills available for this user.</Text>
            ) : null}
        </View>
    );
}