import { useTheme } from "@/hooks/useTheme";
import { CursusUser } from "../services/data";
import { useResponsive } from "@/hooks/useResponsive";
import { StyleSheet, Text, View } from "react-native";
import SkillBar from './SkillBar';

type SectionSkillsProps = {
    lastActiveCursus: CursusUser | null;
}

export default function SectionSkills({lastActiveCursus} : SectionSkillsProps) {
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
            fontSize: isLandscape? ms(15) : ms(20),
            fontWeight: "bold",
            color: theme.colors.primary
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Skills</Text>
            </View>
            {lastActiveCursus?.skills.map(skill => (
                <SkillBar key={skill.id} skill={skill}/>
            ))}
        </View>
    );
}