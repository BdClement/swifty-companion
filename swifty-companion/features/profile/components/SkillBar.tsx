import { useTheme } from "@/hooks/useTheme";
import { Skill } from "../services/data";
import { useResponsive } from "@/hooks/useResponsive";
import { StyleSheet, Text, View } from "react-native";

type SkillBarProps = {
    skill: Skill
}

export default function SkillBar({ skill} : SkillBarProps) {
    const theme = useTheme();
    const { ms, hs, vs , isLandscape} = useResponsive();
    const percent = Math.min((skill.level / 10) * 100, 100);

    const styles = StyleSheet.create({
        container: {
            height: isLandscape? ms(30) : ms(50),
            flexDirection: "row",
            alignItems: "center",
            marginBottom: isLandscape? ms(0) : ms(0),
        },
        skillHeader: {
            width: "50%",
        },
        barContainer: {
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "flex-end"
        },
        barFill: {
            height: "50%",
            backgroundColor: theme.colors.primary,
            borderTopLeftRadius: ms(6),
            borderBottomLeftRadius: ms(6),
            justifyContent: "center",
            alignItems: "flex-end",
        },
        name: {
            fontSize: isLandscape? ms(10) : ms(14),
        },
        level: {
            color: theme.colors.background,
            fontSize: isLandscape? ms(10) : ms(14),
            fontWeight: "bold",
            marginEnd: isLandscape? ms(10) : ms(6),
            justifyContent: "flex-start",
            alignItems: "center",
        }
    });
    
    return (
        <View style={styles.container}>
            <View style={styles.skillHeader}>
                <Text style={styles.name}>{skill.name}</Text>
            </View>

            <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${percent}%` }]}>
                    <Text style={styles.level}>{skill.level.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );
}